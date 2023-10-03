import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RoleType } from '../../../constants';
import { TokenType } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ApiConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.authConfig.accessTokenPrivateKey,
        });
    }

    async validate(args: {
        userId: Uuid;
        role: RoleType;
        type: TokenType;
    }): Promise<UserEntity> {
        if (args.type !== TokenType.ACCESS_TOKEN) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.findOne({
            id: args.userId as never,
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.settings && !user.settings.isDefaultPasswordChanged) {
            throw new ForbiddenException('default password need to be changed');
        }

        return user;
    }
}
