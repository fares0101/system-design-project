import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { doctorsData } from './[id]';

const DoctorsList = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    // استخلاص التخصصات المتاحة
    const specialties = Array.from(new Set(doctorsData.map(doctor => doctor.specialty)));

    // تصفية الأطباء حسب مصطلح البحث والتخصص
    const filteredDoctors = doctorsData.filter(doctor => {
        const matchesSearch = searchTerm === '' ||
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialty = selectedSpecialty === '' || doctor.specialty === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
    });

    return (
        <>
            <Head>
                <title>{t('doctors.title')} | {t('common.appName')}</title>
                <meta name="description" content={t('doctors.title')} />
            </Head>

            <div className="bg-gray-100 min-h-screen">
                {/* الشريط العلوي */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
                                    <span className="text-xl ltr:mr-2 rtl:ml-2">←</span>
                                    {t('dashboard.title')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* محتوى الصفحة */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">{t('doctors.title')}</h1>

                        <div className="w-full md:w-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                            {/* البحث */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">🔍</span>
                                </div>
                            </div>

                            {/* تصفية حسب التخصص */}
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                <option value="">{t('doctors.allSpecialties')}</option>
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* قائمة الأطباء */}
                    {filteredDoctors.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <p className="text-gray-500">{t('doctors.noDoctors')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
                                    onClick={() => router.push(`/dashboard/doctors/${doctor.id}`)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">👨‍⚕️</span>
                                            </div>
                                            <div className="ltr:ml-4 rtl:mr-4">
                                                <h2 className="text-lg font-medium text-gray-900">{doctor.name}</h2>
                                                <p className="text-sm text-primary-600">{doctor.specialty}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="ltr:ml-1 rtl:mr-1 text-sm text-gray-500">{doctor.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t border-gray-200 pt-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                <span className="font-medium">{t('doctors.experience')}:</span> {doctor.experience}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                <span className="font-medium">{t('appointments.price')}:</span> {doctor.appointmentPrice} {t('appointments.currency')}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">{doctor.availableDays.length} {t('doctors.availableDays')}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/dashboard/doctors/${doctor.id}`);
                                                }}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                                            >
                                                {t('appointments.bookNow')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default DoctorsList; 