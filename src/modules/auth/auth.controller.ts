import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UploadedFile,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiFile, Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { GrantAccessTokenDto } from './dto/GrantAccessTokenDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import type { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        const token = await this.authService.handleLogin({
            userId: userEntity.id,
            role: userEntity.role,
        });

        return new LoginPayloadDto(userEntity.toDto(), token, {
            isEmailVerified: userEntity.settings?.isEmailVerified,
            isDefaultPasswordChanged:
                userEntity.settings?.isDefaultPasswordChanged,
        });
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    @ApiFile({ name: 'avatar' })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
        @UploadedFile() file?: IFile,
    ): Promise<UserDto> {
        const createdUser = await this.userService.registerUser(
            userRegisterDto,
            file,
        );

        return createdUser.toDto({
            isActive: true,
        });
    }

    @Post('access-token')
    @UseGuards(AuthGuard('refresh-token'))
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: GrantAccessTokenDto })
    async grantAccessToken(@Req() req): Promise<TokenPayloadDto> {
        const refreshToken = req.headers['x-refresh-token'] as string;

        return this.authService.grantAccessToken(
            req.user as UserEntity,
            refreshToken,
        );
    }

    @Get('me')
    @Auth({})
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    getCurrentUser(@AuthUser() user: UserEntity): UserDto {
        return user.toDto();
    }
}
