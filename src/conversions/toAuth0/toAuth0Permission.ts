import { Auth0Permission } from '../../types';

export const toAuth0Permission = (
    permissionName: string,
    resourceServerId: string,
): Auth0Permission => ({
    resource_server_identifier: resourceServerId,
    permission_name: permissionName,
});
