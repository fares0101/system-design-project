/**
 * إعلان محلي لمكتبة semver
 */
declare module 'semver' {
    export function valid(version: string): string | null;
    export function inc(version: string, release: string): string | null;
    export function satisfies(version: string, range: string): boolean;
    export function compare(v1: string, v2: string): -1 | 0 | 1;
} 