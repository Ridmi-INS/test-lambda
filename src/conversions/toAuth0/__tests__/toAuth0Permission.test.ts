import { toAuth0Permission } from '../toAuth0Permission';

describe('toAuth0Permission', () => {
    it('converts as expected', () => {
        expect(toAuth0Permission('permName', 'rsid')).toEqual({
            resource_server_identifier: 'rsid',
            permission_name: 'permName',
        });
    });
});
