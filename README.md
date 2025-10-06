# Express API with MongoDB and Prisma ORM

This project is a RESTful API built with Express.js, TypeScript, and Prisma ORM with MongoDB. It features a modular architecture, JWT-based authentication, role-based access control (ADMIN, COACH, STUDENT), and uses MongoDB database for flexible document storage.

---

## Features

- **Modular Architecture**: Code is organized by feature (Auth, Users, Courses).
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Role-Based Access Control**: Differentiated permissions for ADMIN, COACH, and STUDENT roles.
- **Prisma ORM with MongoDB**: Type-safe database access with document-based storage.
- **MongoDB Database**: NoSQL document storage with flexible schema.
- **DTO Validation**: Type-safe request validation using Zod.
- **Centralized Error Handling**: Robust and consistent error responses.
- **Database Seeding**: Pre-populated sample data for development.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (v6.0 or higher)
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

#### MongoDB Database Setup

You can use either local MongoDB or MongoDB Atlas:

**Option A: Local MongoDB**

1. Install MongoDB on your system
2. Start MongoDB service:

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string from Atlas dashboard

### 4. Environment Configuration

Create a `.env` file in the root of the project:

```env
# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-and-long-key-that-is-hard-to-guess

# MongoDB Database Configuration
# Local MongoDB:
DATABASE_URL="mongodb://localhost:27017/express_generic_repo_api"

# Or MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/express_generic_repo_api"
```

**Important**:

- Replace the connection string with your actual MongoDB credentials
- For Atlas, replace `username`, `password`, and `cluster` with your values
- Make sure the JWT_SECRET is a long, random string

### 5. Database Setup and Seeding

```bash
# Generate Prisma client
npm run db:generate

# Push schema to MongoDB (creates collections)
npm run db:push

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

| Role  | Email        | Password |
| ----- | ------------ | -------- |
| ADMIN | admin@no.com | admin123 |
| COACH | coach@no.com | coach123 |

---

## Database Schema (MongoDB Collections)

### Entity Relationship Overview

```mermaid
erDiagram
    User {
        ObjectId _id PK "MongoDB ObjectId"
        string id "Mapped string ID"
        string name "User full name"
        string email UK "Unique email address"
        string password "Bcrypt hashed password"
        UserRole role "ADMIN, COACH, STUDENT"
        datetime createdAt "Creation timestamp"
        datetime updatedAt "Last update timestamp"
    }

    Course {
        ObjectId _id PK "MongoDB ObjectId"
        string id "Mapped string ID"
        string title "Course title"
        string description "Course description"
        string image "Optional image URL"
        ObjectId createdById FK "Foreign key to User._id"
        datetime createdAt "Creation timestamp"
        datetime updatedAt "Last update timestamp"
    }

    User ||--o{ Course : "creates"
```

### Collections

- **users**: User accounts with authentication and role information
- **courses**: Course content linked to user creators

### Relationships

- **User → Course**: One-to-Many (A user can create multiple courses)
- **Foreign Key**: `Course.createdById` references `User._id`

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
npm run db:push          # Push schema changes to MongoDB
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:reset         # Reset database and run seed
```

---

## MongoDB Advantages

### Why MongoDB + Prisma?

**Document-Based Storage:**

- Natural JSON-like data structure
- Flexible schema evolution
- Embedded documents and arrays
- No complex joins needed

**Scalability:**

- Horizontal scaling (sharding)
- High performance for read/write operations
- Built-in replication and failover

**Developer Experience:**

- Type-safe queries with Prisma
- No migrations needed for schema changes
- Rich query capabilities with aggregation
- Modern ORM features

**ObjectId Benefits:**

- Globally unique identifiers
- Embedded creation timestamp
- No auto-increment coordination needed
- Distributed-system friendly

---

## Project Structure

```
├── docs/
│   └── ERD_MONGODB.md            # Entity Relationship Diagram documentation
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── seed.ts                   # Database seeding script
├── src/
│   ├── server.ts                 # Application entry point
│   ├── auth/                     # Authentication module
│   ├── courses/                  # Courses module
│   ├── shared/                   # Shared utilities and middleware
│   │   ├── database/
│   │   │   └── prisma.ts         # Prisma client configuration
│   │   └── repositories/
│   │       └── base.repository.ts # Prisma-based repository
│   └── users/                    # Users module
├── .env                         # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## Migration from In-Memory to MongoDB

This implementation uses MongoDB with Prisma ORM, providing:

### Key Benefits

1. **Data Persistence**: Data survives server restarts
2. **Scalability**: MongoDB's horizontal scaling capabilities
3. **Flexibility**: Schema-less design allows easy field additions
4. **Performance**: Optimized for modern applications
5. **Type Safety**: Prisma provides compile-time type checking

### Document Storage Example

```javascript
// User Document
{
  "_id": ObjectId("65f7a1b2c3d4e5f6a7b8c9d0"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$...",
  "role": "COACH",
  "createdAt": ISODate("2024-03-17T10:30:00.000Z"),
  "updatedAt": ISODate("2024-03-17T10:30:00.000Z")
}
```

---

## Development Workflow

### Adding New Features

1. Update Prisma schema in `prisma/schema.prisma`
2. Push changes: `npm run db:push`
3. Generate client: `npm run db:generate`
4. Update entities, repositories, and services
5. Test the changes

### Schema Evolution

MongoDB's flexible schema means:

- Add new fields without migrations
- Optional fields can be added anytime
- Documents can have different structures
- Backward compatibility is maintained

---

## Troubleshooting

### Database Connection Issues

1. Verify MongoDB is running (local) or connection string is correct (Atlas)
2. Check network connectivity for Atlas
3. Verify credentials in `.env`
4. Test connection: `npm run db:push`

### Common Issues

```bash
# Connection timeout
# Check if MongoDB service is running

# Authentication failed
# Verify username/password in connection string

# Database not found
# MongoDB creates databases automatically, check collection names
```

### Reset Everything

```bash
# Complete reset
npm run db:reset
```

---

## Production Deployment

### Environment Variables

Ensure these environment variables are set in production:

- `NODE_ENV=production`
- `DATABASE_URL` (production MongoDB URL)
- `JWT_SECRET` (secure random string)
- `PORT` (optional, defaults to 3000)

### MongoDB Atlas Production

1. Use MongoDB Atlas for managed hosting
2. Configure network access (IP whitelist)
3. Use strong passwords and connection string
4. Enable monitoring and alerts

### Deployment Steps

```bash
# Build application
npm run build

# Set production environment variables
export NODE_ENV=production
export DATABASE_URL="your-production-mongodb-url"

# Start production server
npm start
```

---

## MongoDB-Specific Features

### Advanced Queries

The repository layer supports MongoDB-specific features:

```typescript
// Text search (requires text index)
await courseRepository.searchByTitle("javascript");

// Aggregation pipelines
await courseRepository.aggregate([
  { $match: { createdById: userId } },
  { $group: { _id: "$createdById", count: { $sum: 1 } } },
]);

// Complex filtering
await courseRepository.findWhere({
  title: { $regex: "react", $options: "i" },
  createdAt: { $gte: new Date("2024-01-01") },
});
```

### Indexing

Recommended indexes for performance:

```javascript
// In MongoDB shell or Atlas
db.users.createIndex({ email: 1 });
db.courses.createIndex({ createdById: 1 });
db.courses.createIndex({ title: "text", description: "text" });
```

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test with MongoDB connection
4. Create a Pull Request
5. Wait for review and approval

---

## License

This project is licensed under the ISC License.

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

| Method   | Endpoint         | Description                                | Access         |
| :------- | :--------------- | :----------------------------------------- | :------------- |
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
