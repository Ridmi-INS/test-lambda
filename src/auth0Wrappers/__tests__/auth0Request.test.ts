import axios from 'axios';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { auth0Request, Auth0ResponseValidationError } from '../auth0Request';
import { mockAuth0Ctx } from './mockAuth0Ctx';
import { AnyAuth0RequestBody } from '../../types';

jest.mock('axios');

const mockAuth0CtxWithToken = { ...mockAuth0Ctx, mgmtToken: 'atoken' };

// eslint-disable-next-line max-lines-per-function
describe('auth0Request', () => {
    it('works for a GET request (defaults to it)', async () => {
        (axios.request as jest.Mock).mockImplementationOnce(
            async ({ method, validateStatus }) => {
                expect(method).toEqual('GET');
                // validate status should equal true no matter what
                expect(validateStatus()).toEqual(true);

                return {
                    status: 200,
                    data: { a: 'a' },
                };
            },
        );
        const result = await auth0Request<{ a: string }>(
            mockAuth0CtxWithToken,
            {
                body: yup.object({ a: yup.string().defined() }),
            },
            'exampleurl',
        );

        expect(result).toEqual({
            status: StatusCodes.OK,
            body: { a: 'a' },
        });
        expect(axios.request).toHaveBeenCalledWith({
            method: 'GET',
            maxBodyLength: Infinity,
            data: undefined,
            url: 'https://exampleurl',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer atoken`,
                'Content-Type': 'application/json',
            },
            validateStatus: expect.any(Function),
        });
    });

    it('works for a POST request', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({
            status: 201,
            data: { a: 'a' },
        });
        const result = await auth0Request<{ a: string }>(
            mockAuth0CtxWithToken,
            {
                body: yup.object({ a: yup.string().defined() }),
            },
            'exampleurl',
            'POST',
            { b: 'b' } as unknown as AnyAuth0RequestBody,
        );

        expect(result).toEqual({
            status: StatusCodes.CREATED,
            body: { a: 'a' },
        });
        expect(axios.request).toHaveBeenCalledWith({
            method: 'POST',
            maxBodyLength: Infinity,
            data: { b: 'b' },
            url: 'https://exampleurl',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer atoken`,
                'Content-Type': 'application/json',
            },
            validateStatus: expect.any(Function),
        });
    });

    it('throws Auth0ResponseValidationError when returned value doesnt pass validation', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({
            status: 200,
            data: { c: 'a' },
        });
        await expect(
            auth0Request<{ a: string }>(
                mockAuth0CtxWithToken,
                {
                    body: yup.object({ a: yup.string().defined() }),
                },
                'https://exampleurl',
            ),
        ).rejects.toThrow(Auth0ResponseValidationError);
    });

    it('throws Auth0ResponseValidationError when returned value has invalid status code', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({
            status: 1034885859483985,
            data: { a: 'a' },
        });
        await expect(
            auth0Request<{ a: string }>(
                mockAuth0CtxWithToken,
                {
                    body: yup.object({ a: yup.string().defined() }),
                },
                'https://exampleurl',
            ),
        ).rejects.toThrow(Auth0ResponseValidationError);
    });

    it('throws error when mgmt token not provided', async () => {
        await expect(
            auth0Request<{ a: string }>(
                mockAuth0Ctx,
                {
                    body: yup.object({ a: yup.string().defined() }),
                },
                'https://exampleurl',
            ),
        ).rejects.toThrow();
    });
});
