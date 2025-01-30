# 📌 Prescription App - Prescription Management System

A full-stack web application for managing prescriptions, built with **MERN stack (MongoDB, Express.js, React.js, Node.js)** and designed using a **microservices architecture**.

---

## 🌐 Local Development URLs
- **Frontend:** http://localhost:3001
- **Backend Services:**
  - **Gateway:** http://localhost:5001
  - **API Documentation:** http://localhost:5000
  
---
## 📌 Important Links
- **Youtube Video:** [Youtube]([https://prescription-backend.onrender.com](https://www.youtube.com/watch?v=ocroGZAr5_4))
- **Render:** [Render Live App](https://prescription-frontend.onrender.com)
  
---

## 🏗 Architecture & Design
### **Microservices Architecture**
The application follows a microservices-based architecture with independent services:

- **Gateway Service:** API Gateway for routing and load balancing
- **Doctor Service:** Manages doctor profiles and prescription creation
- **Auth Service:** Handles authentication and authorization (JWT-based)
- **Prescription Service:** Manages prescriptions
- **Pharmacy Service:** Handles prescription processing
- **Notification Service:** Sends real-time notifications via RabbitMQ
- **Admin Service:** Provides administrative controls

### **Tech Stack**
#### **Frontend:**
- React.js
- Material-UI
- Redux Toolkit
- Axios for API communication

#### **Backend:**
- Node.js
- Express.js
- MongoDB
- Redis (Caching layer)
- RabbitMQ (Message Queue)

#### **DevOps & Deployment:**
- Docker
- Docker Compose
- Render (Cloud Deployment)

---

## 📂 Data Models
### **User**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "picture": "string"
}
```
### **Doctor**
```json
{
  "_id": "string",
  "userId": "string",
  "fullName": "string",
  "specialization": "string",
  "status": "string"
}
```
### **Prescription**
```json
{
  "_id": "string",
  "doctorId": "string",
  "patientId": "string",
  "medications": "array",
  "status": "string"
}
```
### **Pharmacy**
```json
{
  "_id": "string",
  "name": "string",
  "location": "object",
  "status": "string"
}
```

---

## ✨ Features
### **User Management**
- JWT Authentication
- Role-based access control (Doctor, Patient, Pharmacist, Admin)
- Profile management

### **Prescription Management**
- Doctors can create digital prescriptions
- Patients can access their prescription history
- Pharmacies can validate and process prescriptions

### **Notification System**
- Real-time updates via RabbitMQ
- Email notifications for prescription updates

### **Security & Authentication**
- Secure authentication using JWT
- Role-based authorization
- Redis caching for faster authentication

---

## 🔍 Design Decisions & Assumptions
### **Authentication**
- JWT-based authentication with token refresh mechanism
- Role-based access control for different users

### **Prescription Management**
- Only doctors can issue prescriptions
- Patients can only view their own prescriptions
- Pharmacies can only access prescriptions assigned to them

### **Notification System**
- RabbitMQ-based event-driven architecture
- Email and in-app notifications for users

---

## 🚀 Challenges & Solutions
### **Microservices Communication**
- **Challenge:** Managing inter-service communication
- **Solution:** Implemented RabbitMQ and API Gateway

### **Security Concerns**
- **Challenge:** Ensuring secure prescription access
- **Solution:** Implemented role-based access and JWT authentication

### **Performance Optimization**
- **Challenge:** Speeding up frequent queries
- **Solution:** Implemented Redis for caching

---

## 🚀 Future Improvements
### **Technical Enhancements**
- Implement distributed tracing
- Introduce service discovery
- Add advanced monitoring & logging

### **Feature Additions**
- AI-powered prescription suggestions
- Telemedicine video consultations
- Payment gateway for premium features
- Mobile application support

---

## 🛠 Setup Instructions
### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB
- Redis
- RabbitMQ
- Docker (optional)

---

## 🌍 Accessing the Application
- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:5001
- **API:** http://localhost:5000


---
