import { auth0Request } from '../auth0Request';
import {
    getResourceServers,
    getResourceServerById,
    updateResourceServer,
} from '../auth0ResourceServerRequests';
import { Auth0RequestFn } from './Auth0RequestFn';
import { mockAuth0Ctx } from './mockAuth0Ctx';

jest.mock('../auth0Request');

const mockAuth0Request = auth0Request as jest.Mock;

// we are not extensively testing the functions
// because the request functions are considered declarative
describe('auth0ResourceServerRequests', () => {
    it.each<{ fn: Auth0RequestFn; testName: string }>([
        {
            fn: getResourceServers,
            testName: 'getResourceServers',
        },
        {
            fn: getResourceServerById,
            testName: 'getResourceServerById',
        },
        {
            fn: updateResourceServer,
            testName: 'updateResourceServer',
        },
    ])('$testName calls auth0Request once', ({ fn }) => {
        mockAuth0Request.mockReset();
        mockAuth0Request.mockResolvedValue('dummyResponseValue');
        expect(fn(mockAuth0Ctx, 'abc', 'def')).resolves.toEqual(
            'dummyResponseValue',
        );
        expect(mockAuth0Request).toHaveBeenCalledTimes(1);
    });
});
