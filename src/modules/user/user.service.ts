import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException, UserNotFoundException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { CreateSettingsCommand } from './commands/create-settings.command';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import type { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import type { UserSettingsEntity } from './user-settings.entity';
import { UserTokenEntity } from './user-token.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigService } from '@src/configs/config.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ImportUserDto } from './dtos/import-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(UserTokenEntity)
        private userTokenRepository: Repository<UserTokenEntity>,
        private validatorService: ValidatorService,
        private commandBus: CommandBus,
        private configService: ConfigService,
    ) {}

    /**
     * Find single user
     */
    findOne(
        findData: FindOptionsWhere<UserEntity>,
    ): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: {
                ...findData,
                isDeleted: false,
            },
            relations: {
                settings: true,
                role: {
                    permissions: true,
                },
            },
        });
    }

    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | null> {
        const queryBuilder = this.userRepository
            .createQueryBuilder('users')
            .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }

        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }

        return queryBuilder.getOne();
    }

    @Transactional()
    async registerUser(
        userRegisterDto: UserRegisterDto,
        file?: IFile,
    ): Promise<UserEntity> {
        const user = this.userRepository.create(userRegisterDto);

        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        // Handle upload file here

        await this.userRepository.save(user);

        user.settings = await this.createSettings(
            user.id,
            plainToClass(CreateSettingsDto, {
                isEmailVerified: true,
                isPhoneVerified: false,
                isDefaultPasswordChanged: true,
            }),
        );

        return user;
    }

    @Transactional()
    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        const defaultPassword = this.configService.memberDefaultPassword;
        const user = this.userRepository.create({
            password: defaultPassword,
            ...createUserDto,
        });

        await this.userRepository.save(user);

        user.settings = await this.createSettings(
            user.id,
            plainToClass(CreateSettingsDto, {
                isEmailVerified: false,
                isPhoneVerified: false,
                isDefaultPasswordChanged: false,
            }),
        );

        return user.toDto();
    }

    @Transactional()
    async importUsers(importUserDto: ImportUserDto): Promise<any> {
        const { importedData, mappedFields } = importUserDto;

        const users = importedData.map((record: any) => {
            const user: any = {};
            Object.entries(mappedFields).forEach((entry) => {
                const [key, value] = entry;
                user[value] = record[key];
            });

            return user;
        });

        // Validate user

        return this.createUsers(users);
    }

    @Transactional()
    async createUsers(createUsersDto: CreateUserDto[]): Promise<any> {
        const defaultPassword = this.configService.memberDefaultPassword;
        const users = this.userRepository.create(
            createUsersDto.map((user) => {
                return {
                    password: defaultPassword,
                    ...user,
                };
            }),
        );

        await this.userRepository.save(users);

        await Promise.all(
            users.map((user) => {
                return this.createSettings(
                    user.id,
                    plainToClass(CreateSettingsDto, {
                        isEmailVerified: false,
                        isPhoneVerified: false,
                    }),
                );
            }),
        );

        return {};
    }

    async updateUser({
        userId,
        updateUserDto,
    }: {
        userId: Uuid;
        updateUserDto: UpdateUserDto;
    }): Promise<UserDto> {
        const queryBuilder = this.userRepository
            .createQueryBuilder()
            .update()
            .set(updateUserDto);

        queryBuilder.where('id = :userId', { userId });
        queryBuilder.andWhere('is_deleted = :isDeleted', { isDeleted: false });

        return this.getUser(userId);
    }

    async deleteUser({ userId }: { userId: Uuid }): Promise<UpdateResult> {
        const queryBuilder = this.userRepository
            .createQueryBuilder()
            .update()
            .set({
                isDeleted: true,
            });

        return await queryBuilder.where('id = :userId', { userId }).execute();
    }

    async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<PageDto<UserDto>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        queryBuilder.where('is_deleted = :isDeleted', {
            isDeleted: false,
        });

        const [items, pageMetaDto] =
            await queryBuilder.paginate(pageOptionsDto);

        return items.toPageDto(pageMetaDto);
    }

    async getUser(userId: Uuid): Promise<UserDto> {
        const queryBuilder = this.userRepository.createQueryBuilder();

        queryBuilder.where('id = :userId', { userId });

        queryBuilder.andWhere('is_deleted = :isDeleted', {
            isDeleted: false,
        });

        const userEntity = await queryBuilder.getOne();

        if (!userEntity) {
            throw new UserNotFoundException();
        }

        return userEntity.toDto();
    }

    async createSettings(
        userId: Uuid,
        createSettingsDto: CreateSettingsDto,
    ): Promise<UserSettingsEntity> {
        return this.commandBus.execute<
            CreateSettingsCommand,
            UserSettingsEntity
        >(new CreateSettingsCommand(userId, createSettingsDto));
    }

    async storeUserToken({
        userId,
        refreshToken,
    }: {
        userId: Uuid;
        refreshToken: string;
    }) {
        return this.userTokenRepository
            .createQueryBuilder()
            .insert()
            .values({
                userId,
                refreshToken,
            })
            .execute();
    }

    async revokeUserTokens(userId: Uuid) {
        await this.userTokenRepository
            .createQueryBuilder()
            .update()
            .set({
                revoked: true,
            })
            .where('user_id = :userId', { userId })
            .execute();
    }

    async getUserToken({
        userId,
        refreshToken,
    }: {
        userId: Uuid;
        refreshToken: string;
    }): Promise<UserTokenEntity | null> {
        return this.userTokenRepository
            .createQueryBuilder()
            .where('user_id = :userId', { userId })
            .andWhere('refresh_token = :refreshToken', { refreshToken })
            .getOne();
    }
}
