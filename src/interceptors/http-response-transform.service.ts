import type {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
    data: T;
}

@Injectable()
export class HttpResponseTransformInterceptor<T>
    implements NestInterceptor<T, IResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<T>> {
        return next.handle().pipe(
            map((response) => {
                if (response?.data) {
                    return {
                        data: response.data,
                        success: true,
                    };
                }

                return {
                    data: response || {},
                    success: true,
                };
            }),
        );
    }
}
