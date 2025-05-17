/**
 * إعلان محلي لمكتبة json-schema
 */
declare module 'json-schema' {
    export interface JSONSchema4 {
        id?: string;
        $schema?: string;
        title?: string;
        description?: string;
        type?: string | string[];
        format?: string;
        [key: string]: any;
    }
} 