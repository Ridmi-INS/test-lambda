import {
    APIGatewayProxyResult as ApiGatewayProxyResult,
    APIGatewayEvent as ApiGatewayEvent,
} from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { authDeclarationValidator } from './validators';
import { AuthDeclaration } from './types';
import { makeAuth0Context } from './auth0Wrappers';
import { getConfigFromEnv } from './internal';
import { Auth0RepoImpl } from './persistence';
import { syncAuth0 } from './application';

export const handler = async (
    event: ApiGatewayEvent,
    // context: Context,
): Promise<ApiGatewayProxyResult> => {
    const authDeclaration: AuthDeclaration =
        await authDeclarationValidator.validate(event);

    const config = getConfigFromEnv();
    const ctx = makeAuth0Context(config);

    ctx.logger.info(
        { config },
        `About to sync Auth0 roles and permissions using the given config`,
    );

    const repo = new Auth0RepoImpl(ctx);

    await syncAuth0(authDeclaration, { ctx, repo });

    return {
        statusCode: StatusCodes.OK,
        body: JSON.stringify({
            message: 'valid',
        }),
    };
};
