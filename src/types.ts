/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
    ...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
    [P in keyof Required<Entity>]: Required<Entity>[P] extends U
        ? P
        : Required<Entity>[P] extends U[]
        ? P
        : never;
}[keyof Entity];
