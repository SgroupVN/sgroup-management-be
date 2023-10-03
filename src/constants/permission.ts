/***
 * Dumb code, every we require new permissions in a route, we need to go and update the annotation
 * We can fix it by mapping <url, method> => required_permissions by saving the configuration in an in-memory storage.
 */

export enum Permission {
    CanGetListUsers = 'CAN_GET_USERS',
    CanGetListRoles = 'CAN_GET_ROLES',
    CanGetListPermissions = 'CAN_GET_PERMISSIONS',
}

export const REQUIRED_PERMISSIONS = Symbol('REQUIRED_PERMISSIONS');
