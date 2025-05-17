import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

// قائمة وهمية بالأطباء (في التطبيق الحقيقي ستأتي من قاعدة البيانات)
export const doctorsData = [
    {
        id: 1,
        name: 'د. محمد أحمد',
        specialty: 'قلب',
        rating: 4.8,
        appointmentPrice: 250,
        availableDays: ['السبت', 'الاثنين', 'الأربعاء'],
        availableHours: ['09:00', '11:30', '13:00', '16:30'],
        experience: '15 سنة',
        bio: 'دكتور متخصص في أمراض القلب والأوعية الدموية، حاصل على الزمالة الأمريكية والبورد الأوروبي في أمراض القلب. يمتلك خبرة واسعة في تشخيص وعلاج مختلف أمراض القلب ويقدم رعاية شاملة لمرضاه.',
        image: '/doctors/doctor1.jpg',
        location: 'عيادة الصفوة - مدينة نصر',
        reviews: [
            { id: 1, author: 'أحمد محمود', date: '2023-04-10', rating: 5, comment: 'طبيب ممتاز ومتعاون جداً. شرح الحالة بوضوح وقدم توصيات مفيدة.' },
            { id: 2, author: 'سارة علي', date: '2023-03-25', rating: 4, comment: 'تجربة جيدة، زمن الانتظار قليل والعيادة منظمة.' }
        ]
    },
    {
        id: 2,
        name: 'د. فاطمة محمود',
        specialty: 'أطفال',
        rating: 4.9,
        appointmentPrice: 200,
        availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
        availableHours: ['10:00', '12:30', '15:00', '18:00'],
        experience: '12 سنة',
        bio: 'طبيبة أطفال متخصصة في رعاية الأطفال والرضع، حاصلة على الدكتوراه في طب الأطفال مع خبرة خاصة في حالات الحساسية وأمراض الجهاز التنفسي للأطفال. تتميز بالصبر والتعامل اللطيف مع الأطفال.',
        image: '/doctors/doctor2.jpg',
        location: 'مركز الأطفال التخصصي - المهندسين',
        reviews: [
            { id: 1, author: 'منى حسن', date: '2023-05-15', rating: 5, comment: 'دكتورة ممتازة ولطيفة جداً مع الأطفال. طفلي يحبها ولا يشعر بالخوف عند زيارتها.' },
            { id: 2, author: 'محمد سامي', date: '2023-04-30', rating: 5, comment: 'تشخيص دقيق وعلاج فعال. نشكرها على اهتمامها بحالة ابنتي.' }
        ]
    },
    {
        id: 3,
        name: 'د. خالد إبراهيم',
        specialty: 'عظام',
        rating: 4.7,
        appointmentPrice: 300,
        availableDays: ['السبت', 'الاثنين', 'الثلاثاء', 'الخميس'],
        availableHours: ['09:30', '12:00', '14:30', '17:00', '19:30'],
        experience: '20 سنة',
        bio: 'استشاري جراحة العظام والمفاصل والعمود الفقري. متخصص في جراحات استبدال المفاصل والمناظير وعلاج إصابات الملاعب. يمتلك خبرة واسعة في علاج مشاكل العمود الفقري وخشونة الركبة.',
        image: '/doctors/doctor3.jpg',
        location: 'المركز الطبي الدولي - المعادي',
        reviews: [
            { id: 1, author: 'خالد عثمان', date: '2023-04-20', rating: 5, comment: 'من أفضل أطباء العظام، قام بعلاج مشكلة مزمنة كنت أعاني منها لسنوات.' },
            { id: 2, author: 'ريم أحمد', date: '2023-03-12', rating: 4, comment: 'طبيب ذو خبرة كبيرة، يستمع جيداً للمريض ويشرح الحالة بدقة.' }
        ]
    }
];

// قائمة المواعيد المحجوزة (سيتم مشاركتها مع صفحات أخرى)
export const appointmentsData = [
    {
        id: 1,
        doctor: {
            id: 1,
            name: 'د. محمد أحمد',
            specialty: 'قلب',
            image: '/doctors/doctor1.jpg'
        },
        date: '2023-05-12',
        time: '10:30',
        clinic: 'العيادة الأولى',
        clinicAddress: 'عيادة الصفوة - مدينة نصر',
        status: 'قادم',
        price: 250,
        notes: 'فحص دوري',
        patientName: 'أحمد محمود',
        createdAt: '2023-05-01'
    },
    {
        id: 2,
        doctor: {
            id: 2,
            name: 'د. فاطمة محمود',
            specialty: 'أطفال',
            image: '/doctors/doctor2.jpg'
        },
        date: '2023-05-15',
        time: '11:45',
        clinic: 'العيادة الثانية',
        clinicAddress: 'مركز الأطفال التخصصي - المهندسين',
        status: 'قادم',
        price: 200,
        notes: 'فحص للحساسية',
        patientName: 'سارة أحمد',
        createdAt: '2023-05-05'
    }
];

const DoctorProfile = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { id } = router.query;
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    // حالة لتخزين المواعيد (في التطبيق الحقيقي ستُخزن في خادم)
    const [appointments, setAppointments] = useState(appointmentsData);

    // استرجاع بيانات الطبيب
    const doctor = doctorsData.find(d => d.id === Number(id));

    // في حالة التحميل
    if (!doctor) {
        return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
    }

    // تقديم الحجز
    const handleBooking = (e) => {
        e.preventDefault();

        // إنشاء موعد جديد
        const newAppointment = {
            id: appointments.length + 1,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                specialty: doctor.specialty,
                image: doctor.image
            },
            date: selectedDate,
            time: selectedTime,
            clinic: doctor.location.split('-')[0].trim(),
            clinicAddress: doctor.location,
            status: 'قادم',
            price: doctor.appointmentPrice,
            notes: '',
            patientName: 'المستخدم الحالي',
            createdAt: new Date().toISOString().split('T')[0]
        };

        // إضافة الموعد الجديد إلى قائمة المواعيد
        appointmentsData.push(newAppointment);
        setAppointments([...appointments, newAppointment]);

        // عرض رسالة نجاح وإغلاق النافذة بعد فترة
        setTimeout(() => {
            setBookingSuccess(true);
            setTimeout(() => {
                setIsBookingModalOpen(false);
                setBookingSuccess(false);
                setSelectedDate('');
                setSelectedTime('');

                // التوجه إلى صفحة تفاصيل الموعد الجديد
                router.push(`/dashboard/appointments/${newAppointment.id}`);
            }, 2000);
        }, 1000);
    };

    return (
        <>
            <Head>
                <title>{doctor.name} | {t('common.appName')}</title>
                <meta name="description" content={`${doctor.name} - ${doctor.specialty}`} />
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
                    {/* معلومات الطبيب */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="md:flex">
                            <div className="md:shrink-0 p-6 flex items-center justify-center bg-gray-50">
                                <div className="h-48 w-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl">👨‍⚕️</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                                        <p className="text-lg text-primary-600 mb-4">{t('doctors.specialization')}: {doctor.specialty}</p>

                                        <div className="flex items-center mb-4">
                                            <span className="text-yellow-400 text-lg">★</span>
                                            <span className="ltr:ml-1 rtl:mr-1 text-gray-700">{doctor.rating}/5</span>
                                            <span className="ltr:ml-2 rtl:mr-2 text-gray-500">({doctor.reviews.length} {t('doctors.rating')})</span>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-gray-600"><span className="font-medium">{t('doctors.experience')}:</span> {doctor.experience}</p>
                                            <p className="text-gray-600"><span className="font-medium">{t('clinics.address')}:</span> {doctor.location}</p>
                                            <p className="text-gray-600"><span className="font-medium">{t('appointments.price')}:</span> {doctor.appointmentPrice} {t('appointments.currency')}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsBookingModalOpen(true)}
                                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md shadow-sm"
                                    >
                                        {t('appointments.bookNow')}
                                    </button>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h3 className="text-lg font-medium mb-2">{t('doctors.about')}</h3>
                                    <p className="text-gray-600">{doctor.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* أيام وساعات العمل */}
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">{t('doctors.availability')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium mb-2">{t('doctors.availableDays')}</h3>
                                <ul className="space-y-2">
                                    {doctor.availableDays.map((day) => (
                                        <li key={day} className="text-gray-600 flex items-center">
                                            <span className="text-primary-500 ltr:mr-2 rtl:ml-2">✓</span> {day}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">{t('doctors.availableHours')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.availableHours.map((hour) => (
                                        <span key={hour} className="inline-block bg-primary-50 text-primary-700 rounded-full px-3 py-1">
                                            {hour}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* تقييمات المرضى */}
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">{t('doctors.reviews')} ({doctor.reviews.length})</h2>

                        <div className="space-y-6">
                            {doctor.reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-medium">{review.author}</div>
                                        <div className="text-gray-500">{review.date}</div>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* نافذة حجز موعد */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ltr:text-left sm:rtl:text-right sm:w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {t('appointments.bookNew')} - {doctor.name}
                                        </h3>

                                        {bookingSuccess ? (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-center text-green-600 mb-2">
                                                    <span className="text-3xl">✓</span>
                                                </div>
                                                <p className="text-green-600 font-medium">{t('appointments.bookingSuccess')}</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleBooking} className="mt-4">
                                                <div className="mb-4">
                                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                        {t('appointments.selectDay')}
                                                    </label>
                                                    <select
                                                        id="date"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        required
                                                    >
                                                        <option value="">{t('appointments.selectDay')}</option>
                                                        {doctor.availableDays.map(day => (
                                                            <option key={day} value={day}>{day}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                                        {t('appointments.selectTime')}
                                                    </label>
                                                    <select
                                                        id="time"
                                                        value={selectedTime}
                                                        onChange={(e) => setSelectedTime(e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        required
                                                    >
                                                        <option value="">{t('appointments.selectTime')}</option>
                                                        {doctor.availableHours.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-600">
                                                        {t('appointments.price')}: <span className="font-medium">{doctor.appointmentPrice} {t('appointments.currency')}</span>
                                                    </p>
                                                </div>

                                                <div className="mt-6">
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md shadow-sm"
                                                    >
                                                        {t('appointments.confirmBooking')}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ltr:ml-3 sm:rtl:mr-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsBookingModalOpen(false)}
                                >
                                    {bookingSuccess ? t('common.close') : t('common.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export async function getStaticPaths() {
    // إنشاء المسارات لصفحات الأطباء
    const paths = doctorsData.map((doctor) => ({
        params: { id: doctor.id.toString() },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ params, locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default DoctorProfile; 