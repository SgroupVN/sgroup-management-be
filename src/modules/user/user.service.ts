import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere, UpdateResult } from 'typeorm';
import { Like, Repository } from 'typeorm';
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
import { DeleteUsersDto } from './dtos/delete-users.dto';
import { RoleType } from '@src/constants';
import { RoleService } from '../access-control/role/role.service';
import { PageMetaDto } from '@src/common/dto/page-meta.dto';

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
        private roleService: RoleService,
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
        const role = await this.roleService.getByName(RoleType.MEMBER);
        const user = this.userRepository.create({
            role,
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

        return this.createUsers(users);
    }

    @Transactional()
    async createUsers(createUsersDto: CreateUserDto[]): Promise<any> {
        const defaultPassword = this.configService.memberDefaultPassword;
        const role = await this.roleService.getByName(RoleType.MEMBER);
        const users = this.userRepository.create(
            createUsersDto.map((user) => {
                return {
                    role,
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
        await queryBuilder.execute();

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

    async deleteUsers(deleteUsersDto: DeleteUsersDto): Promise<UpdateResult> {
        const queryBuilder = this.userRepository
            .createQueryBuilder()
            .update()
            .set({
                isDeleted: true,
            });

        return await queryBuilder
            .where('id IN(:...ids)', { ids: deleteUsersDto.ids })
            .execute();
    }

    async getUsers(
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<PageDto<UserDto>> {
        const queryableFields = ['name', 'major', 'email', 'phone'];
        const role = await this.roleService.getByName(RoleType.MEMBER);

        const query = {
            where: {
                isDeleted: false,
                role: {
                    id: role?.id,
                },
            },
            relations: {
                role: true,
            },
            order: {},
        };

        queryableFields.forEach((field) => {
            if (pageOptionsDto[field]) {
                query.where[field] = Like(pageOptionsDto[field]);
            }
        });

        if (pageOptionsDto.sort) {
            query.order = pageOptionsDto.sort;
        }

        const items = await this.userRepository.find(query);
        const itemCount = await this.userRepository.count({
            where: query.where,
        });

        const pageMetaDto = new PageMetaDto({
            itemCount,
            pageOptionsDto,
        });

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
