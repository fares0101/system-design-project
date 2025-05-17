# نظام إدارة حجوزات العيادات الطبية متعدد الفروع
# Multi-Branch Medical Clinic Booking System

## نظرة عامة | Overview
نظام متكامل لإدارة حجوزات العيادات الطبية متعددة الفروع، يتيح للمرضى حجز المواعيد وإدارة سجلاتهم الطبية، ويساعد الأطباء والإداريين في إدارة الجداول الزمنية والمواعيد.

A comprehensive system for managing multi-branch medical clinic bookings, allowing patients to book appointments and manage their medical records, while helping doctors and administrators manage schedules and appointments.

## المميزات الرئيسية | Key Features
- واجهة مستخدم سهلة الاستخدام للمرضى | User-friendly interface for patients
- نظام إدارة متكامل للأطباء | Comprehensive management system for doctors
- لوحة تحكم للإدارة | Administrative dashboard
- نظام إشعارات متكامل | Integrated notification system
- واجهة برمجة تطبيقات (API) | RESTful API
- دعم متعدد اللغات | Multi-language support

## التقنيات المستخدمة | Technologies Used
- Frontend: React.js, Next.js
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Mobile: React Native
- Authentication: JWT
- Real-time: Socket.io
- Containerization: Docker
- CI/CD: GitHub Actions

## هيكل المشروع | Project Structure
```
medical-booking-system/
├── frontend/                 # React.js web application
├── mobile/                   # React Native mobile app
├── backend/                  # Node.js backend services
│   ├── auth-service/        # Authentication service
│   ├── booking-service/     # Booking management service
│   ├── doctor-service/      # Doctor management service
│   └── notification-service/# Notification service
├── shared/                  # Shared utilities and types
└── docs/                    # Documentation
```

## متطلبات التشغيل | Requirements
- Node.js >= 16.x
- PostgreSQL >= 13
- Docker & Docker Compose
- npm or yarn

## التثبيت | Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development servers
```bash
# Start backend services
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

# Start mobile app
cd ../mobile
npm run start
```

## المساهمة | Contributing
نرحب بمساهماتكم! يرجى قراءة دليل المساهمة للمزيد من المعلومات.
Contributions are welcome! Please read our contributing guide for more information.

## الترخيص | License
هذا المشروع مرخص تحت رخصة MIT.
This project is licensed under the MIT License. 