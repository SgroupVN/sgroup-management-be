import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import { TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { RoleEntity } from '../access-control/role/role.entity';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import type { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ApiConfigService,
        private userService: UserService,
    ) {}

    async generateTokenPair(data: {
        userId: Uuid;
    }): Promise<{ accessToken: string; refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    userId: data.userId,
                    type: TokenType.ACCESS_TOKEN,
                },
                {
                    expiresIn: this.configService.accessTokenLifeTime,
                },
            ),
            this.jwtService.signAsync(
                {
                    userId: data.userId,
                    type: TokenType.REFRESH_TOKEN,
                },
                {
                    privateKey:
                        this.configService.authConfig.refreshTokenPrivateKey,
                    expiresIn: this.configService.refreshTokenLifeTime,
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async handleLogin(data: {
        role?: RoleEntity;
        userId: Uuid;
    }): Promise<TokenPayloadDto> {
        const { userId } = data;

        const { accessToken, refreshToken } = await this.generateTokenPair({
            userId,
        });

        await this.storeRefreshTokenInfo({
            userId,
            refreshToken,
        });

        return new TokenPayloadDto({
            accessToken,
            refreshToken,
        });
    }

    async grantAccessToken(
        user: UserEntity,
        refreshToken: string,
    ): Promise<TokenPayloadDto> {
        const currentUserToken = await this.userService.getUserToken({
            userId: user.id,
            refreshToken,
        });

        if (!currentUserToken) {
            throw new UnauthorizedException();
        }

        if (currentUserToken.revoked) {
            await this.userService.revokeUserTokens(user.id);

            throw new UnauthorizedException();
        }

        const token = await this.generateTokenPair({
            userId: user.id,
        });

        await this.userService.revokeUserTokens(user.id);
        await this.userService.storeUserToken({
            userId: user.id,
            refreshToken: token.refreshToken,
        });

        return new TokenPayloadDto(token);
    }

    async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
        const user = await this.userService.findOne({
            email: userLoginDto.email,
        });

        const isPasswordValid = await validateHash(
            userLoginDto.password,
            user?.password,
        );

        if (!isPasswordValid) {
            throw new UserNotFoundException();
        }

        return user!;
    }

    async storeRefreshTokenInfo({
        userId,
        refreshToken,
    }: {
        userId: Uuid;
        refreshToken: string;
    }) {
        await this.userService.revokeUserTokens(userId);
        await this.userService.storeUserToken({
            refreshToken,
            userId,
        });
    }
}
