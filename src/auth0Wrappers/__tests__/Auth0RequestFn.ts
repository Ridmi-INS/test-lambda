import { Auth0Context, BodyWithStatus } from '../../types';

export type Auth0RequestFn = (
    ctx: Auth0Context,
    // any needed because we are testing many functions with same test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<BodyWithStatus<any>>;
