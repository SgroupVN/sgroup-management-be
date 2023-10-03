import { Injectable } from '@nestjs/common';
import { ConfigService as _ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService extends _ConfigService {
    static instance: ConfigService;

    constructor() {
        if (ConfigService.instance) return ConfigService.instance;
        super();
        ConfigService.instance = this;
    }

    getFromEnv(env: string): string | undefined {
        return this.get<string>(env);
    }

    get nodeEnv(): string {
        return String(this.getFromEnv('ENV'));
    }

    get memberDefaultPassword(): string {
        return String(this.getFromEnv('DEFAULT_MEMBER_PASSWORD'));
    }
}
