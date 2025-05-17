import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession, signIn } from 'next-auth/react';
import { CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { GetStaticProps } from 'next';
import Link from 'next/link';

export default function Home() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const features = [
        {
            name: t('features.easyBooking'),
            description: t('features.easyBookingDesc'),
            icon: CalendarIcon,
        },
        {
            name: t('features.expertDoctors'),
            description: t('features.expertDoctorsDesc'),
            icon: UserGroupIcon,
        },
        {
            name: t('features.timeSaving'),
            description: t('features.timeSavingDesc'),
            icon: ClockIcon,
        },
    ];

    const handleGetStarted = async () => {
        setIsLoading(true);
        router.push('/dashboard');
    };

    return (
        <div className="bg-white">
            {/* Hero section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                            <span className="block">{t('hero.title')}</span>
                            <span className="block text-indigo-200">{t('hero.subtitle')}</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            {t('hero.description')}
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={handleGetStarted}
                                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                {t('common.getStarted')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                            {t('features.title')}
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {t('features.subtitle')}
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            {t('features.description')}
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {features.map((feature) => (
                                <div key={feature.name} className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {feature.name}
                                        </h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className="bg-indigo-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span className="block">{t('cta.title')}</span>
                        <span className="block text-indigo-600">{t('cta.subtitle')}</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <button
                                onClick={handleGetStarted}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isLoading ? t('common.loading') : t('common.getStarted')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale as string, ['common'])),
        },
    };
} 