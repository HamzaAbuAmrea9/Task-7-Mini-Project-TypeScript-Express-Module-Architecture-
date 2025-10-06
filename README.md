# Express API with Prisma ORM and MySQL

This project is a RESTful API built with Express.js, TypeScript, and Prisma ORM. It features a modular architecture, JWT-based authentication, role-based access control (ADMIN, COACH, STUDENT), and uses MySQL database for persistent data storage.

---

## Features

- **Modular Architecture**: Code is organized by feature (Auth, Users, Courses).
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Role-Based Access Control**: Differentiated permissions for ADMIN, COACH, and STUDENT roles.
- **Prisma ORM**: Type-safe database access with automatic migrations.
- **MySQL Database**: Persistent data storage with relational database.
- **DTO Validation**: Type-safe request validation using Zod.
- **Centralized Error Handling**: Robust and consistent error responses.
- **Database Seeding**: Pre-populated sample data for development.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) (v8.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd express-generic-repo-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

#### MySQL Database Setup

1. Install MySQL on your system
2. Create a new database:

```sql
CREATE DATABASE express_generic_repo_api;
```

3. Create a MySQL user (optional but recommended):

```sql
CREATE USER 'apiuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON express_generic_repo_api.* TO 'apiuser'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Environment Configuration

Create a `.env` file in the root of the project:

```env
# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-and-long-key-that-is-hard-to-guess

# Database Configuration
# Format: mysql://username:password@host:port/database_name
DATABASE_URL="mysql://root:password@localhost:3306/express_generic_repo_api"
```

**Important**:

- Replace `root:password` with your MySQL username and password
- Update the database name if you used a different name
- Make sure the JWT_SECRET is a long, random string

### 5. Database Migration and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Create and apply database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

The server will be running on `http://localhost:3001`.

### 7. Verify Setup

Visit `http://localhost:3001/health` to check if the database connection is working.

---

## Default Users

After seeding, you can use these accounts for testing:

| Role    | Email          | Password   |
| ------- | -------------- | ---------- |
| ADMIN   | admin@no.com   | admin123   |
| COACH   | coach@no.com   | coach123   |
| STUDENT | student@no.com | student123 |

---

## API Endpoints

| Method   | Endpoint         | Description                                | Access         |
| :------- | :--------------- | :----------------------------------------- | :------------- |
| `GET`    | `/health`        | Check API and database health              | Public         |
| `POST`   | `/auth/register` | Register a new user (defaults to STUDENT). | Public         |
| `POST`   | `/auth/login`    | Log in a user and receive a JWT.           | Public         |
| `GET`    | `/users/me`      | Get the profile of the current user.       | Authenticated  |
| `PUT`    | `/users/me`      | Update the profile of the current user.    | Authenticated  |
| `POST`   | `/users/coach`   | Create a new user with the COACH role.     | ADMIN Only     |
| `GET`    | `/courses`       | Get a list of all courses.                 | Public         |
| `GET`    | `/courses/:id`   | Get a single course by its ID.             | Public         |
| `POST`   | `/courses`       | Create a new course.                       | ADMIN, COACH   |
| `PUT`    | `/courses/:id`   | Update a course.                           | ADMIN, Creator |
| `DELETE` | `/courses/:id`   | Delete a course.                           | ADMIN, Creator |

---

## Available Scripts

### Development

```bash
npm run dev           # Start development server with hot reload
npm run build         # Build TypeScript to JavaScript
npm start            # Start production server
```

### Database Management

```bash
npm run db:generate       # Generate Prisma client
npm run db:push          # Push schema changes to database (development)
npm run db:migrate       # Create and apply new migration
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:reset         # Reset database and run all migrations + seed
```
