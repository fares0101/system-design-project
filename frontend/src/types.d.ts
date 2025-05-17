declare module 'react' {
    export interface SVGProps<T> {
        className?: string;
        style?: any;
        [key: string]: any;
    }

    export type ComponentType<P = {}> = (props: P) => JSX.Element | null;
    export const useState: <T>(initialState: T | (() => T)) => [T, (state: T | ((prevState: T) => T)) => void];
}

declare module 'next-i18next/serverSideTranslations' {
    export function serverSideTranslations(
        locale: string,
        namespacesRequired?: string[],
        configOverride?: any
    ): Promise<any>;
}

declare module '@heroicons/react/24/outline' {
    export const CalendarIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    export const UserGroupIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    export const ClockIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

declare module 'next-i18next' {
    export function useTranslation(
        namespace?: string | string[],
        options?: {
            keyPrefix?: string;
        }
    ): {
        t: (key: string, options?: object) => string;
        i18n: {
            language: string;
            changeLanguage: (lng: string) => Promise<Function>;
        };
    };

    export function appWithTranslation(Component: React.ComponentType<any>): React.ComponentType<any>;
}

declare module 'next/router' {
    export const useRouter: () => {
        route: string;
        pathname: string;
        query: { [key: string]: string | string[] };
        asPath: string;
        push: (url: string, as?: string) => Promise<boolean>;
        replace: (url: string, as?: string) => Promise<boolean>;
        reload: () => void;
        back: () => void;
        prefetch: (url: string) => Promise<void>;
        beforePopState: (cb: (state: any) => boolean) => void;
        events: {
            on: (event: string, callback: (...args: any[]) => void) => void;
            off: (event: string, callback: (...args: any[]) => void) => void;
            emit: (event: string, ...args: any[]) => void;
        };
        locale: string;
    };
}

declare module 'next-auth/react' {
    export const useSession: () => { data: any; status: string };
    export const signIn: (provider?: string, options?: any) => Promise<any>;
    export const signOut: (options?: any) => Promise<any>;
    export const SessionProvider: React.ComponentType<{ session?: any; children?: React.ReactNode }>;
}

declare module 'next' {
    export type GetStaticProps = (context: any) => Promise<{ props: any }>;
}

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

declare module 'next/app' {
    export interface AppProps {
        Component: React.ComponentType<any>;
        pageProps: any;
    }
} 