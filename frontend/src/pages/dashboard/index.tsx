import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { appointmentsData } from './doctors/[id]';

// المكونات
const Sidebar = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation('common');
    const router = useRouter();

    const navigation = [
        { name: t('dashboard.appointments'), href: '/dashboard/appointments', icon: '📅', current: true },
        { name: t('dashboard.doctors'), href: '/dashboard/doctors', icon: '👨‍⚕️', current: false },
        { name: t('dashboard.clinics'), href: '/dashboard/clinics', icon: '🏥', current: false },
        { name: t('dashboard.profile'), href: '/dashboard/profile', icon: '👤', current: false },
    ];

    return (
        <>
            {/* الشاشات الصغيرة */}
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-20 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <div className={`fixed inset-y-0 rtl:right-0 ltr:left-0 flex max-w-xs w-full bg-white transition duration-300 transform lg:translate-x-0 z-30 lg:static lg:min-h-screen ${isOpen
                ? 'rtl:translate-x-0 ltr:translate-x-0'
                : 'rtl:translate-x-full ltr:-translate-x-full'
                }`}>
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
                    <div className="flex items-center h-16 px-4 border-b border-gray-200">
                        <div className="flex-shrink-0">
                            <img
                                className="h-8 w-auto"
                                src="/logo.svg"
                                alt="Logo"
                            />
                        </div>
                        <div className="flex-1 px-2 flex justify-end lg:hidden">
                            <button
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                onClick={() => setIsOpen(false)}
                            >
                                ✖️
                            </button>
                        </div>
                    </div>
                    <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md 
                    ${item.current ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                                >
                                    <span className="flex-shrink-0 ltr:mr-3 rtl:ml-3 text-xl">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

// مكون المواعيد القادمة
const UpcomingAppointments = () => {
    const { t } = useTranslation('common');
    const router = useRouter();

    // استخدام المواعيد المحفوظة
    const appointments = appointmentsData;

    if (appointments.length === 0) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <div className="text-4xl text-gray-400 mx-auto">📅</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('appointments.noAppointments')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('appointments.bookNew')}</p>
                <div className="mt-6">
                    <Link
                        href="/dashboard/doctors"
                        className="btn-primary"
                    >
                        {t('appointments.newAppointment')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3.5 px-3 text-sm font-semibold text-gray-900 rtl:text-right ltr:text-left">
                            {t('appointments.doctor')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                            {t('appointments.date')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                            {t('appointments.time')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900">
                            {t('appointments.clinic')}
                        </th>
                        <th scope="col" className="relative py-3.5 px-3">
                            <span className="sr-only">{t('common.actions')}</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)} className="cursor-pointer hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 px-3 text-sm">
                                <div className="font-medium text-gray-900">{appointment.doctor.name}</div>
                                <div className="text-gray-500">{appointment.doctor.specialty}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {appointment.date}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {appointment.time}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {appointment.clinic}
                            </td>
                            <td className="relative whitespace-nowrap py-4 px-3 text-right text-sm font-medium">
                                <Link href={`/dashboard/appointments/${appointment.id}`} className="text-primary-600 hover:text-primary-800">
                                    {t('common.view')}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// مكون الأطباء المقترحين
const SuggestedDoctors = () => {
    const { t } = useTranslation('common');
    const router = useRouter();

    const doctors = [
        {
            id: 1,
            name: 'د. محمد أحمد',
            specialty: 'قلب',
            rating: 4.8,
            image: '/doctors/doctor1.jpg'
        },
        {
            id: 2,
            name: 'د. فاطمة محمود',
            specialty: 'أطفال',
            rating: 4.9,
            image: '/doctors/doctor2.jpg'
        },
        {
            id: 3,
            name: 'د. خالد إبراهيم',
            specialty: 'عظام',
            rating: 4.7,
            image: '/doctors/doctor3.jpg'
        }
    ];

    const handleDoctorClick = (id) => {
        router.push(`/dashboard/doctors/${id}`);
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
                <div
                    key={doctor.id}
                    className="relative flex items-center space-x-3 rtl:space-x-reverse rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-gray-400 cursor-pointer"
                    onClick={() => handleDoctorClick(doctor.id)}
                >
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xl">👨‍⚕️</span>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="focus:outline-none">
                            <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-500 truncate">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                                <span className="text-yellow-400">★</span>
                                <span className="ltr:ml-1 rtl:mr-1 text-sm text-gray-500">{doctor.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-6 sm:col-span-2 lg:col-span-3 flex justify-center">
                <Link
                    href="/dashboard/doctors"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                    {t('common.viewAll')} {t('doctors.title')}
                </Link>
            </div>
        </div>
    );
};

// الصفحة الرئيسية
export default function Dashboard() {
    const { t } = useTranslation('common');
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // التحويل للصفحة الرئيسية أثناء التحميل فقط
    if (status === 'loading') {
        return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
    }

    // إلغاء التحقق من جلسة الدخول للعرض التجريبي
    // if (status === 'unauthenticated') {
    //     typeof window !== 'undefined' && router.push('/');
    //     return null;
    // }

    const userName = session?.user?.name || t('common.getStarted');

    // حساب عدد المواعيد القادمة
    const upcomingAppointmentsCount = appointmentsData.length;

    // للتطبيق الحقيقي، يمكن إضافة منطق لفلترة المواعيد حسب نوعها

    return (
        <>
            <Head>
                <title>{t('dashboard.title')} | {t('common.appName')}</title>
                <meta name="description" content={t('dashboard.title')} />
            </Head>

            <div className="h-screen flex overflow-hidden bg-gray-100">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* المحتوى الرئيسي */}
                <div className="flex-1 overflow-auto focus:outline-none">
                    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
                        <button
                            type="button"
                            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="text-2xl">☰</span>
                        </button>

                        <div className="flex-1 px-4 flex justify-between">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#">
                                    <label htmlFor="search-field" className="sr-only">
                                        {t('common.search')}
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="pointer-events-none absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3">
                                            <span className="text-lg">🔍</span>
                                        </div>
                                        <input
                                            id="search-field"
                                            className="block h-full w-full border-transparent py-2 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                            placeholder={t('common.search')}
                                            type="search"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="ltr:ml-4 rtl:mr-4 flex items-center md:ltr:ml-6 md:rtl:mr-6">
                                <button
                                    type="button"
                                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <span className="sr-only">{t('common.notifications')}</span>
                                    <span className="text-xl">🔔</span>
                                </button>

                                {/* ملف المستخدم */}
                                <div className="ltr:ml-3 rtl:mr-3 relative">
                                    <div>
                                        <button
                                            type="button"
                                            className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            id="user-menu-button"
                                        >
                                            <span className="sr-only">فتح قائمة المستخدم</span>
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-sm">👤</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main>
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <div className="pb-5 border-b border-gray-200">
                                <h1 className="text-2xl font-bold leading-tight text-gray-900">
                                    {t('dashboard.welcome')}, {userName}
                                </h1>
                            </div>

                            {/* بطاقات الإحصائيات */}
                            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">📅</span>
                                            </div>
                                            <div className="ltr:ml-5 rtl:mr-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        {t('dashboard.upcomingAppointments')}
                                                    </dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">{upcomingAppointmentsCount}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/dashboard/appointments" className="font-medium text-primary-600 hover:text-primary-700">
                                                {t('common.viewAll')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">📋</span>
                                            </div>
                                            <div className="ltr:ml-5 rtl:mr-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        {t('dashboard.pastAppointments')}
                                                    </dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">8</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/dashboard/appointments?tab=past" className="font-medium text-primary-600 hover:text-primary-700">
                                                {t('common.viewAll')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl">🏥</span>
                                            </div>
                                            <div className="ltr:ml-5 rtl:mr-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        {t('dashboard.favoriteClinics')}
                                                    </dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">3</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                                        <div className="text-sm">
                                            <Link href="/dashboard/clinics?tab=favorites" className="font-medium text-primary-600 hover:text-primary-700">
                                                {t('common.viewAll')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* المواعيد القادمة */}
                            <div className="mt-8">
                                <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {t('dashboard.upcomingAppointments')}
                                    </h3>
                                    <div className="mt-3 sm:mt-0 sm:ltr:ml-4 sm:rtl:mr-4">
                                        <Link
                                            href="/dashboard/appointments/new"
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            {t('appointments.newAppointment')}
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <UpcomingAppointments />
                                </div>
                            </div>

                            {/* الأطباء المقترحين */}
                            <div className="mt-8">
                                <div className="pb-5 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {t('dashboard.suggestedDoctors')}
                                    </h3>
                                </div>
                                <div className="mt-4">
                                    <SuggestedDoctors />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
} 