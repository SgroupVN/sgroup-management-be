import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { PublicStrategy } from './strategies/public.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: (configService: ApiConfigService) => ({
                privateKey: configService.authConfig.accessTokenPrivateKey,
                publicKey: configService.authConfig.accessTokenPublicKey,
                signOptions: {
                    algorithm: 'RS256',
                    expiresIn: '1d',
                },
                verifyOptions: {
                    algorithms: ['RS256'],
                },
            }),
            inject: [ApiConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        RefreshTokenStrategy,
        AccessTokenStrategy,
        PublicStrategy,
    ],
    exports: [JwtModule, AuthService],
})
export class AuthModule {}
