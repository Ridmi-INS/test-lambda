import axios from 'axios';
import { getAuth0Token } from '../getAuth0Token';
import { Auth0ResponseValidationError } from '../auth0Request';
import { mockAuth0Ctx } from './mockAuth0Ctx';

jest.mock('axios');

describe('getAuth0Token', () => {
    it('works in happy path', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({
            data: { access_token: 'bobstoken' },
        });
        const result = await getAuth0Token(mockAuth0Ctx);
        expect(result).toEqual('bobstoken');
        expect(axios.request).toHaveBeenCalledWith({
            method: 'POST',
            url: 'https://abcurl/oauth/token',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: 'cid',
                client_secret: 'cs',
                audience: 'https://abcurl/api/v2/',
            }),
        });
    });

    it('throws Auth0ResponseValidationError when response lacks the expected data', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({
            data: { wrong_name_data: 'bobstoken' },
        });
        expect(getAuth0Token(mockAuth0Ctx)).rejects.toThrow(
            Auth0ResponseValidationError,
        );
    });

    it('throws Auth0ResponseValidationError when response lacks data at all', async () => {
        (axios.request as jest.Mock).mockResolvedValueOnce({});
        expect(getAuth0Token(mockAuth0Ctx)).rejects.toThrow(
            Auth0ResponseValidationError,
        );
    });
});
