/* eslint-disable @typescript-eslint/no-explicit-any */
/* The rule above should be reenabled before merging to main */
import * as yup from 'yup';
import axios, { AxiosRequestConfig } from 'axios';
import { AnyAuth0RequestBody, Auth0Context, BodyWithStatus } from '../types';
import { StatusCodes } from 'http-status-codes';

export class Auth0ResponseValidationError extends Error {
    public name = 'Auth0ResponseValidationError';
}

const makeAxiosOptions = (
    ctx: Auth0Context,
    urlArg: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
    data: AnyAuth0RequestBody | undefined = undefined,
): AxiosRequestConfig<any> => {
    if (!ctx.mgmtToken) {
        throw new Error('No auth0 management token defined');
    }

    const url = urlArg.startsWith('http://') ? urlArg : `https://${urlArg}`;

    return {
        method,
        maxBodyLength: Infinity,
        url,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${ctx.mgmtToken}`,
            'Content-Type': 'application/json',
        },
        // bypass the status check so we can check it ourselves
        validateStatus: () => true,
        data,
    };
};

const redactAuthorization = (
    inp: AxiosRequestConfig<any>,
): AxiosRequestConfig<any> => ({
    ...inp,
    headers: {
        ...inp.headers,
        Authorization: '[redacted]',
    },
});

const DEFAULT_STATUSES = [
    StatusCodes.OK,
    StatusCodes.CREATED,
    StatusCodes.ACCEPTED,
];

export const auth0Request = async <T extends yup.AnyObject>(
    ctx: Auth0Context,
    {
        body,
        allowedStatuses: allowedStatusesArg,
    }: {
        body: yup.ObjectSchema<T>;
        allowedStatuses?: Array<StatusCodes>;
    },
    url: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE' = 'GET',
    data: AnyAuth0RequestBody | undefined = undefined,
): Promise<BodyWithStatus<T>> => {
    const options = makeAxiosOptions(ctx, url, method, data);
    const result = await axios.request(options);

    const allowedStatuses = allowedStatusesArg ?? DEFAULT_STATUSES;

    if (!allowedStatuses.includes(result.status)) {
        ctx.logger.error(
            {
                responseData: result.data,
                options: redactAuthorization(options),
            },
            `Unexpected status code ${result.status} from Axios when doing ${method} ${url}`,
        );
        throw new Auth0ResponseValidationError(
            `Unexpected status code ${result.status} from Axios`,
        );
    }

    try {
        return {
            status: result.status as StatusCodes,
            // https://github.com/jquense/yup/issues/2116
            body: (await body.validate(result.data)) as T,
        };
    } catch (err) {
        ctx.logger.error(
            { body: result.data, err },
            `Encountered error validating this Auth0 response body`,
        );
        throw new Auth0ResponseValidationError(
            `Could not validate response body from Auth0`,
        );
    }
};
