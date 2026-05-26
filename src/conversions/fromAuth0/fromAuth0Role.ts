import { Auth0Role, Role } from '../../types';

export const fromAuth0Role = (role: Auth0Role): Required<Role> => ({
    auth0Id: role.id,
    name: role.name,
    description: role.description,
});
