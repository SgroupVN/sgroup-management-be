import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { HttpResponseTransformInterceptor } from './interceptors/http-response-transform.service';
import { PermissionModule } from './modules/access-control/permission/permission.module';
import { RoleModule } from './modules/access-control/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        RoleModule,
        PermissionModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ApiConfigService) =>
                configService.postgresConfig,
            inject: [ApiConfigService],
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }

                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        HealthCheckerModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpResponseTransformInterceptor,
        },
    ],
})
export class AppModule {}
