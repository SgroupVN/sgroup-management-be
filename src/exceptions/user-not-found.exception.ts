import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super(
            {
                message: 'error.userNotFound',
                success: false,
                statusCode: 404,
            },
            error,
        );
    }
}
