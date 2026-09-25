# Billing-WebApp
A full-stack billing and management application built using **Spring Boot** and **React**.

## Features

* User login and authentication
* JWT-based security
* Dashboard
* Category management
* Item/product management
* User management
* Order management
* Order history
* Receipt generation
* Razorpay payment integration
* Image upload using AWS S3
* MySQL database

## Technologies Used

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Spring Security
* JWT
* MySQL
* AWS S3
* Razorpay
* Maven
* Lombok

### Frontend

* React
* Vite
* React Router
* Axios
* Bootstrap
* JavaScript

## Project Structure

```text
Project/
│
├── Backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
└── Frontend/
    └── client/
        ├── src/
        ├── public/
        ├── package.json
        └── vite.config.js
```

## Requirements

Install these before running the project:

* Java 21
* MySQL
* Node.js
* npm
* Git

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE billing_app;
```

Update the database configuration in:

```text
Backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billing_app
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

## Backend Setup

Open a terminal inside the `Backend` folder:

```bash
cd Backend
```

Run the Spring Boot application:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux/Mac

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

API base path:

```text
http://localhost:8080/api/v1.0
```

## Frontend Setup

Open another terminal inside:

```text
Frontend/client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

## Configuration

The backend uses:

* MySQL for database
* JWT for authentication
* AWS S3 for image storage
* Razorpay for payments

Before running the application, configure your own:

```properties
aws.access.key=YOUR_AWS_ACCESS_KEY
aws.secret.key=YOUR_AWS_SECRET_KEY
aws.region=YOUR_AWS_REGION
aws.bucket.name=YOUR_BUCKET_NAME

jwt.secret.key=YOUR_JWT_SECRET

razorpay.key.id=YOUR_RAZORPAY_KEY
razorpay.key.secret=YOUR_RAZORPAY_SECRET
```

**Do not upload passwords, AWS keys, JWT secrets, or Razorpay secrets to GitHub.**

## How to Run

1. Start MySQL.
2. Create the `billing_app` database.
3. Configure `application.properties`.
4. Start the Spring Boot backend.
5. Open the `Frontend/client` folder.
6. Run `npm install`.
7. Run `npm run dev`.
8. Open the frontend URL in your browser.

## Author

**Anurag**

This project was developed as a Java Full Stack project using Spring Boot and React.
