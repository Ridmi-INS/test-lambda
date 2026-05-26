import { fromAuth0GetPermissions } from '../fromAuth0GetPermissions';

describe('fromAuth0GetPermissions', () => {
    it('converts empty as expected', () => {
        expect(
            fromAuth0GetPermissions({
                start: 0,
                limit: 2,
                total: 0,
                permissions: [],
            }),
        ).toEqual([]);
    });

    it('converts as expected', () => {
        expect(
            fromAuth0GetPermissions({
                start: 0,
                limit: 2,
                total: 2,
                permissions: [
                    {
                        resource_server_identifier: 'rsi1',
                        permission_name: 'pn1',
                        resource_server_name: 'rsn1',
                        description: 'd1',
                    },
                    {
                        resource_server_identifier: 'rsi2',
                        permission_name: 'pn2',
                        resource_server_name: 'rsn2',
                        description: 'd2',
                    },
                ],
            }),
        ).toEqual([
            {
                value: 'pn1',
                description: 'd1',
            },
            {
                value: 'pn2',
                description: 'd2',
            },
        ]);
    });
});
