# Online Assessment Platform

An end-to-end **Online Assessment Platform** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This system supports **admin-driven exam creation**, **question bank management**, **secure student exams**.

This project is designed for academic institutions and training platforms to conduct online exams with better control, monitoring, and scalability.

🔐 Authentication & Role-Based Access

This Online Assessment Platform implements role-based authentication to ensure security and real-world usability.

👨‍🎓 Student Role

Students can register and log in

Attend available exams

Submit exams and view dashboard

👉 Evaluators can test student functionality by registering a new student account using the live link.

👨‍💼 Admin Role

Admin can create exams

Create question banks

Manage students and assessments

⚠️ Admin credentials are intentionally not shared publicly to prevent unauthorized access and protect system integrity.

If admin access is required for evaluation purposes, credentials can be shared upon request.

---

## 🚀 Features

### 👨‍💼 Admin Module

- Admin authentication (JWT-based)
- Create and manage **Question Banks**
- Add, edit, delete questions (MCQ)
- Create exams using question banks
- Assign exams to students
- View **proctoring violation logs**

### 👨‍🎓 Student Module

- Secure student login
- View assigned exams
- Attempt exams within the given time
- Restrictions on tab switching & visibility changes

### 🛡️ Proctoring System

- Detects tab change
- Logs violations (type & message)
- Stores logs in database
- Admin can review all violations

---

## 🧱 Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS / CSS Modules

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 📂 Project Structure

```
🔹 Frontend – React (Vite)

client/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── README.md
│
└── src/
    ├── main.jsx
    ├── index.css
    │
    ├── components/
    │   ├── AdminHeader.jsx
    │   ├── NavBar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── AdminRoute.jsx
    │   └── StudentRoute.jsx
    │
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── ExamPage.jsx
    │   ├── ResultPage.jsx
    │   │
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── AdminCreateExam.jsx
    │       ├── AdminCreateQuestionBank.jsx
    │       ├── AdminQuestionBanks.jsx
    │       ├── AdminExams.jsx
    │       └── AdminProctorLogs.jsx
    │       └── AdminManageExams.jsx
    │       └── AdminUpdateExam.jsx


🔹 Backend – Node.js & Express
server/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
│
├── models/
│   ├── User.js
│   ├── Exam.js
│   ├── Question.js
│   ├── QuestionBank.js
│   ├── Result.js
│   └── ProctorLog.js
│
├── controllers/
│   ├── authController.js
│   ├── examController.js
│   ├── questionController.js
│   ├── questionBankController.js
│   └── resultController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── examRoutes.js
│   ├── questionRoutes.js
│   ├── questionBankRoutes.js
│   ├── resultRoutes.js
│   └── proctorRoutes.js
│   └── analyticsRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js


📝 Notes

Frontend is built using React + Vite

Backend follows MVC architecture (routes → controllers → models)

Authentication is handled using JWT

MongoDB is accessed via Mongoose

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access (Admin / Student)
- Protected API routes
- Token stored in localStorage

---

## 📊 Proctoring Logs

Each violation includes:

- Student ID
- Exam ID
- Violation type (e.g., TAB_SWITCH, VISIBILITY_CHANGE)
- Message
- Timestamp

Stored in MongoDB and viewable by Admin.

---

⚙️ Setup Instructions

This project uses two separate GitHub repositories: one for the Frontend (React) and one for the Backend (Node + Express).

1️⃣ Clone the Repositories

Frontend Repository

git clone https://github.com/srinaveenrajr/Online-Assessment-Platform-Frontend.git
cd Online-Assessment-Platform-Frontend

Backend Repository

git clone https://github.com/srinaveenrajr/Online-Assessment-Platform-Backend.git
cd Online-Assessment-Platform-Backend

2️⃣ Backend Setup (Server)

cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=anyrandomtext

Run the backend server:

npm run dev

Backend will run on: http://localhost:5000

3️⃣ Frontend Setup (Client)
cd client
npm install
npm run dev

Frontend will run on: http://localhost:5173

Make sure the backend is running before starting the frontend.

## 🧑‍💻 Author

Developed as part of a **full-stack learning & assessment project** using MERN stack.

---

## 📄 License

This project is for **educational purposes**. You are free to use and modify it.
```
