import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSettingsHandler } from './commands/create-settings.command';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';
import { UserTokenEntity } from './user-token.entity';
import { ConfigModule } from '@src/configs/config.module';

export const handlers = [CreateSettingsHandler];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            UserSettingsEntity,
            UserTokenEntity,
        ]),
        ConfigModule,
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService, ...handlers],
})
export class UserModule {}
