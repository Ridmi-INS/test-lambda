import { fromAuth0Role } from '../fromAuth0Role';

describe('fromAuth0Role', () => {
    it('converts as expected', () => {
        expect(
            fromAuth0Role({ id: 'aid', name: 'aname', description: 'adesc' }),
        ).toEqual({ auth0Id: 'aid', name: 'aname', description: 'adesc' });
    });
});
