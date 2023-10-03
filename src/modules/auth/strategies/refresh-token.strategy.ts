import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'refresh-token',
) {
    constructor(
        private configService: ApiConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
            secretOrKey: configService.authConfig.refreshTokenPrivateKey,
        });
    }

    async validate(payload: JwtPayload): Promise<UserEntity> {
        if (payload.type !== TokenType.REFRESH_TOKEN) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findOne({
            id: payload.userId as never,
            role: payload.role,
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
