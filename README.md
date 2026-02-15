# SchoolSync - Smart School Management System

A comprehensive, full-stack school management system designed to streamline administrative, academic, and financial operations in educational institutions. SchoolSync provides an integrated platform for managing admissions, attendance, enrollments, fees, results, and user authentication with role-based dashboards for students, teachers, and administrators.

---

## 🎯 Features

### For Students

- **Admission Management** - Online admission application and status tracking
- **Student Dashboard** - Personalized dashboard with academic information
- **Attendance Tracking** - View personal attendance records
- **Results Management** - Access academic results and grades
- **Profile Management** - Update personal profile information
- **Fee Payment Status** - Track fee payment history and status

### For Teachers

- **Teacher Dashboard** - Comprehensive view of classes and students
- **Attendance Management** - Mark and manage student attendance
- **Results Entry** - Input and manage student grades
- **Class Management** - View and manage assigned classes
- **Profile Management** - Manage teacher profile information

### For Administrators

- **Admin Dashboard** - System overview and analytics
- **Student Management** - Manage student records and information
- **Teacher Management** - Manage teacher accounts and assignments
- **Admission Approval** - Review and approve/reject admission applications
- **Fee Management** - Track and manage fee payments
- **Attendance Monitoring** - Monitor overall attendance statistics
- **Results Management** - Oversee grading system

### General Features

- **User Authentication** - Secure login and registration system
- **Role-Based Access Control** - Different permissions for students, teachers, and admins
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Exception Handling** - Global error handling and user-friendly messages

---

## 🛠️ Tech Stack

### Backend

- **Java 21** - Core programming language
- **Spring Boot** - Web application framework
- **Spring Security** - Authentication and authorization
- **JPA/Hibernate** - Object-relational mapping
- **Maven** - Build and dependency management
- **MySQL** - Database (configured in application.properties)

### Frontend

- **React 18+** - UI library
- **Vite** - Fast build tool and dev server
- **Context API** - State management
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

### Tools & Services

- **Git** - Version control
- **REST API** - API architecture

---
  
## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RajTangadi/SchoolSync-Smart-School-Management-System.git
cd SchoolSync-Smart-School-Management-System
```

### 2. Backend Setup (Java Spring Boot)

#### Step 2.1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2.2: Configure Database

Open `src/main/resources/application.properties` and update the following:

```properties
# MySQL Configuration Example
spring.datasource.url=jdbc:mysql://localhost:3306/schoolsync_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Port
server.port=8080

# JWT Secret (for authentication)
app.jwt.secret=your_secret_key_here
app.jwt.expiration=86400000

# SMTP mail settings
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# App-level sender info
app.mail.sender.name=School Sync
app.mail.sender.email=${MAIL_SENDER_EMAIL}

```

#### Step 2.3: Build the Backend

```bash
mvn clean install
```

#### Step 2.4: Run the Backend Application

```bash
mvn spring-boot:run
```

Or using Maven wrapper (Windows):

```bash
mvnw.cmd spring-boot:run
```

The backend will be available at: `http://localhost:8080`

### 3. Frontend Setup (React + Vite)

#### Step 3.1: Navigate to Frontend Directory

```bash
cd Frontend
```

#### Step 3.2: Install Dependencies

```bash
npm install
```

#### Step 3.3: Configure API Endpoint

Open `src/services/api.js` and ensure the API base URL points to your backend:

```javascript
const API_URL = "http://localhost:8080/api";
```

#### Step 3.4: Run the Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173` (or the port shown in terminal)

---

## 📁 Project Structure

```
SchoolSync-Smart-School-Management-System/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/schoolsync/
│   │   │   │       ├── SchoolSyncApplication.java
│   │   │   │       ├── config/           # Configuration classes
│   │   │   │       ├── controller/       # REST API endpoints
│   │   │   │       ├── service/          # Business logic
│   │   │   │       ├── repository/       # Data access layer
│   │   │   │       ├── entity/           # JPA entities
│   │   │   │       ├── dto/              # Data Transfer Objects
│   │   │   │       ├── exception/        # Custom exceptions
│   │   │   │       └── util/             # Utility classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Unit tests
│   ├── pom.xml                      # Maven dependencies
│   └── mvnw, mvnw.cmd             # Maven wrapper scripts
│
├── Frontend/                         # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── AdmissionForm.jsx
│   │   │   ├── Attendance.jsx
│   │   │ 
│   │   ├── context/                 # React Context for state management
│   │   │   └── AuthContext.jsx
│   │   ├── services/                # API services
│   │   │   └── api.js
│   │   └── styles/                  # Global styles
│   │       └── main.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md                         # This file
```

---

## 🔌 API Overview

The backend provides REST APIs for the following core operations:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admissions

- `GET /api/admissions` - Get all admission records
- `POST /api/admissions` - Submit new admission
- `GET /api/admissions/{id}` - Get admission details
- `PUT /api/admissions/{id}/approve` - Approve admission
- `PUT /api/admissions/{id}/reject` - Reject admission

### Attendance

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/{studentId}` - Get student attendance

### Enrollment

- `GET /api/enrollments` - Get enrollment records
- `POST /api/enrollments` - Create new enrollment
- `PUT /api/enrollments/{id}` - Update enrollment

### Fees

- `GET /api/fees` - Get fee records
- `POST /api/fees` - Create fee record
- `PUT /api/fees/{id}/pay` - Record fee payment

### Results

- `GET /api/results` - Get results
- `POST /api/results` - Submit results
- `GET /api/results/{studentId}` - Get student results

### Users

- `GET /api/students` - Get all students
- `GET /api/teachers` - Get all teachers
- `PUT /api/users/{id}` - Update user profile

---

## 👥 User Roles & Permissions

### Student

- View own admission status
- View attendance records
- Check academic results
- Manage profile
- Track fee payment status

### Teacher

- Mark attendance
- Enter grades/results
- View assigned students
- Manage profile

### Admin

- Full system access
- Manage all users (students, teachers)
- Approve/reject admissions
- Monitor attendance
- Manage fees
- View system reports

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - Passwords are hashed before storage
- **Role-Based Access Control (RBAC)** - Endpoint security based on user roles
- **CORS Configuration** - Controlled cross-origin access
- **Global Exception Handling** - Secure error messages
---


## Project Features

- [ ] SMS notifications for attendance and fees
- [ ] Email notifications for admission status
- [ ] Advanced analytics and reporting
- [ ] Integration with payment gateways
- [ ] Online exam system
- [ ] Teacher can upload multiple student result record at once through CSV or excel sheet

---
