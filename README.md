# Express API with Generic Repository Pattern

This project is a RESTful API built with Express.js and TypeScript. It features a modular architecture, JWT-based authentication, role-based access control (ADMIN, COACH, STUDENT), and leverages the Generic Repository Pattern for clean and reusable data access logic. All data is stored in-memory and resets on server restart.

---

## Features

- **Modular Architecture**: Code is organized by feature (Auth, Users, Courses).
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Role-Based Access Control**: Differentiated permissions for ADMIN, COACH, and STUDENT roles.
- **Generic Repository Pattern**: Reusable and type-safe data layer for managing entities.
- **DTO Validation**: Type-safe request validation using Zod.
- **Centralized Error Handling**: Robust and consistent error responses.

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd express-generic-repo-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the root of the project and add the following variables:
    ```env
    # The port the server will run on
    PORT=3001

    # A secret key for signing JWTs (use a long, random string)
    JWT_SECRET=your-super-secret-key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3001`. An initial `ADMIN` user is created automatically on startup:
    - **Email:** `admin@no.com`
    - **Password:** `admin123`

---

## API Endpoints Summary

| Method | Endpoint              | Description                                | Access       |
| :----- | :-------------------- | :----------------------------------------- | :----------- |
| `POST` | `/auth/register`      | Register a new user (defaults to STUDENT). | Public       |
| `POST` | `/auth/login`         | Log in a user and receive a JWT.           | Public       |
| `GET`  | `/users/me`           | Get the profile of the current user.       | Authenticated |
| `PUT`  | `/users/me`           | Update the profile of the current user.    | Authenticated |
| `POST` | `/users/coach`        | Create a new user with the COACH role.     | ADMIN Only   |
| `GET`  | `/courses`            | Get a list of all courses.                 | Public       |
| `GET`  | `/courses/:id`        | Get a single course by its ID.             | Public       |
| `POST` | `/courses`            | Create a new course.                       | ADMIN, COACH |
| `PUT`  | `/courses/:id`        | Update a course.                           | ADMIN, Creator |
| `DELETE`| `/courses/:id`        | Delete a course.                           | ADMIN, Creator |