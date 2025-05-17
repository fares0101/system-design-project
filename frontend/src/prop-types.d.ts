/**
 * إعلان محلي لمكتبة prop-types
 */
declare module 'prop-types' {
    export const array: any;
    export const bool: any;
    export const func: any;
    export const number: any;
    export const object: any;
    export const string: any;
    export const symbol: any;
    export const any: any;
    export const arrayOf: (type: any) => any;
    export const element: any;
    export const instanceOf: (type: any) => any;
    export const node: any;
    export const objectOf: (type: any) => any;
    export const oneOf: (types: any[]) => any;
    export const oneOfType: (types: any[]) => any;
    export const shape: (shape: { [key: string]: any }) => any;
    export const exact: (shape: { [key: string]: any }) => any;
} 