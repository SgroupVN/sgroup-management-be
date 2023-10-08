import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator, ValidateIf } from 'class-validator';
import { isString } from 'lodash';

export function IsPassword(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
                },
            },
        });
    };
}

export function IsTmpKey(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'tmpKey',
            target: object.constructor,
            options: validationOptions,
            validator: {
                validate(value: string): boolean {
                    return isString(value) && /^tmp\//.test(value);
                },
                defaultMessage(): string {
                    return 'error.invalidTmpKey';
                },
            },
        });
    };
}

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
    return ValidateIf((obj, value) => value !== undefined, options);
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
    return ValidateIf((obj, value) => value !== null, options);
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isVietnamesePhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === undefined || value === null) {
                        return true;
                    }

                    const isValidPhone = (phone) =>
                        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
                            phone,
                        );

                    return isValidPhone(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be valid format`;
                },
            },
        });
    };
}
