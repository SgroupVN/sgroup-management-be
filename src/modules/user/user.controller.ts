import {
    Body,
    Get,
    Post,
    Patch,
    Controller,
    Param,
    HttpCode,
    HttpStatus,
    Query,
    ValidationPipe,
    Delete,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { Permission } from '@src/constants/permission';
import { PageDto } from '../../common/dto/page.dto';
import { ApiPageOkResponse, UUIDParam } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ImportUserDto } from './dtos/import-user.dto';
import { UpdateResult } from 'typeorm';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':id')
    //   @Auth([RoleType.USER])
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get user',
        type: UserDto,
    })
    getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
        return this.userService.getUser(userId);
    }

    @Get()
    // @Auth({ permissions: [] })
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
        description: 'Get list users',
        type: PageDto,
    })
    getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<PageDto<UserDto>> {
        return this.userService.getUsers(pageOptionsDto);
    }

    @Post()
    @ApiBody({ type: [CreateUserDto] })
    @ApiPageOkResponse({
        description: 'Create member',
        type: UserDto,
    })
    createUser(@Body() createUsersDto: CreateUserDto[]): Promise<any> {
        return this.userService.createUsers(createUsersDto);
    }

    @Post('/import')
    @ApiBody({ type: [ImportUserDto] })
    @ApiPageOkResponse({
        description: 'Create member',
        type: UserDto,
    })
    importUsers(@Body() importUserDto: ImportUserDto): Promise<any> {
        return this.userService.importUsers(importUserDto);
    }

    @Patch(':userId')
    @ApiParam({ name: 'userId', required: true, type: String })
    @ApiPageOkResponse({
        description: 'Update member',
        type: UserDto,
    })
    updateUser(
        @Param('userId') userId: Uuid,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserDto> {
        return this.userService.updateUser({
            userId,
            updateUserDto,
        });
    }

    @Delete(':userId')
    @ApiParam({ name: 'userId', required: true, type: String })
    @ApiPageOkResponse({
        description: 'Update member',
        type: UserDto,
    })
    deleteUser(@Param('userId') userId: Uuid): Promise<UpdateResult> {
        return this.userService.deleteUser({
            userId,
        });
    }
}
