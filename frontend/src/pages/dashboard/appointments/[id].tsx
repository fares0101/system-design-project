import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { appointmentsData } from '../doctors/[id]';

const AppointmentDetail = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;

    // استرجاع بيانات الموعد
    const appointment = appointmentsData.find(a => a.id === Number(id));

    // في حالة التحميل أو عدم وجود الموعد
    if (!appointment) {
        return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
    }

    // حساب تاريخ ووقت الموعد بتنسيق محلي
    const formattedDate = appointment.date;
    const formattedTime = appointment.time;

    const handleCancelAppointment = () => {
        // في التطبيق الحقيقي، سيتم إرسال طلب إلى الخادم لإلغاء الموعد
        alert(t('appointments.cancelConfirmation'));

        // إزالة الموعد من القائمة (في التطبيق الحقيقي ستتم عملية "soft delete")
        const appointmentIndex = appointmentsData.findIndex(a => a.id === Number(id));
        if (appointmentIndex !== -1) {
            appointmentsData.splice(appointmentIndex, 1);
        }

        router.push('/dashboard');
    };

    return (
        <>
            <Head>
                <title>{t('appointments.details')} | {t('common.appName')}</title>
                <meta name="description" content={t('appointments.details')} />
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
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">{t('appointments.details')}</h1>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('appointments.detailsDescription')}</p>
                            </div>
                            <div className="flex space-x-3 rtl:space-x-reverse">
                                <button
                                    onClick={handleCancelAppointment}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    {t('appointments.cancel')}
                                </button>
                                <Link
                                    href={`/dashboard/doctors/${appointment.doctor.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {t('doctors.viewProfile')}
                                </Link>
                            </div>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.status')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {appointment.status}
                                        </span>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.doctor')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-lg">👨‍⚕️</span>
                                            </div>
                                            <div className="ltr:ml-4 rtl:mr-4">
                                                <div className="text-sm font-medium text-gray-900">{appointment.doctor.name}</div>
                                                <div className="text-sm text-gray-500">{appointment.doctor.specialty}</div>
                                            </div>
                                        </div>
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.date')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formattedDate}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.time')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formattedTime}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.clinic')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.clinic}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('clinics.address')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.clinicAddress}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.price')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.price} {t('appointments.currency')}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.notes')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.notes}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">{t('appointments.bookedAt')}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.createdAt}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg font-medium text-gray-900">{t('appointments.instructions')}</h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('appointments.instructionsDescription')}</p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <ul className="list-disc ltr:pl-5 rtl:pr-5 space-y-2 text-sm text-gray-600">
                                <li>{t('appointments.instructionItem1')}</li>
                                <li>{t('appointments.instructionItem2')}</li>
                                <li>{t('appointments.instructionItem3')}</li>
                                <li>{t('appointments.instructionItem4')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export async function getStaticPaths() {
    const paths = appointmentsData.map((appointment) => ({
        params: { id: appointment.id.toString() },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default AppointmentDetail; 