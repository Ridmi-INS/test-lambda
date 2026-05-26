import {
    Auth0Context,
    Auth0GetResourceServerById,
    Auth0GetResourceServers,
    Auth0UpdateResourceServerRequestBody,
    BodyWithStatus,
} from '../types';
import { auth0Request } from './auth0Request';
import {
    auth0GetResourceServerByIdValidator,
    auth0GetResourceServersValidator,
} from '../validators';

export const getResourceServers = async (
    ctx: Auth0Context,
): Promise<BodyWithStatus<Auth0GetResourceServers>> =>
    auth0Request(
        ctx,
        {
            body: auth0GetResourceServersValidator,
        },
        `${ctx.config.url}/api/v2/resource-servers`,
        'GET',
    );

export const getResourceServerById = async (
    ctx: Auth0Context,
    resourceServerId: string,
): Promise<BodyWithStatus<Auth0GetResourceServerById>> =>
    auth0Request(
        ctx,
        {
            body: auth0GetResourceServerByIdValidator,
        },
        `${ctx.config.url}/api/v2/resource-servers/${encodeURIComponent(resourceServerId)}`,
        'GET',
    );

export const updateResourceServer = async (
    ctx: Auth0Context,
    resourceServerId: string,
    data: Auth0UpdateResourceServerRequestBody,
): Promise<BodyWithStatus<Auth0GetResourceServerById>> =>
    auth0Request(
        ctx,
        {
            body: auth0GetResourceServerByIdValidator,
        },
        `${ctx.config.url}/api/v2/resource-servers/${encodeURIComponent(resourceServerId)}`,
        'PATCH',
        data,
    );
