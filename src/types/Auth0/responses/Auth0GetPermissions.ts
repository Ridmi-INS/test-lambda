export type Auth0GetPermissions = {
    start: number;
    limit: number;
    total: number;
    permissions: Array<{
        resource_server_identifier: string;
        permission_name: string;
        resource_server_name: string;
        description: string;
    }>;
};
