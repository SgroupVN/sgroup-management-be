import { NotFoundException } from '@nestjs/common';

export class RoleNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super(
            {
                message: 'error.roleNotFound',
                success: false,
                statusCode: 404,
            },
            error,
        );
    }
}
