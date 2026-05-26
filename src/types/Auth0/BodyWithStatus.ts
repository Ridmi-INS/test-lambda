import { StatusCodes } from 'http-status-codes';

export type BodyWithStatus<T extends object> = {
    status: StatusCodes;
    body: T;
};
