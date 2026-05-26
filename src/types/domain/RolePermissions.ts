// key is the role name, description is the role description
export type RolePermissions = Record<
    string,
    {
        description: string;
        permissions: Array<string>;
    }
>;
