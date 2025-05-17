import React from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const { locale } = router;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {/* Inter Font for English */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                {/* Cairo Font for Arabic */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div dir={dir}>
                <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </div>
        </>
    );
}

export default appWithTranslation(MyApp); 