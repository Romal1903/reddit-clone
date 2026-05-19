# Posta — Community Discussion Platform

> A full-stack web application for creating communities, sharing posts, voting, and having threaded discussions.

---

## 📌 Introduction

**Posta** is a full-stack community discussion platform. The name *Posta* is simple, post-centric, globally recognizable, and easy to spell — reflecting the core purpose of the application: sharing posts and building communities.

The platform allows users to create accounts, join or create communities, share posts with images, vote on content, and participate in threaded nested comment discussions — all backed by a secure JWT-authenticated REST API.

This project demonstrates production-level software engineering practices including layered architecture, secure authentication, cloud storage integration, and responsive UI design.

---

## 👥 Roles

| Role | Description |
|------|-------------|
| **User (Registered)** | Can sign up, log in, create posts, vote, comment, reply, create communities, search content, and reset password |
| **Guest (Unauthenticated)** | Can only access login, signup, and reset password pages — all other routes are protected |

> 🔒 All content-related actions require authentication via JWT token.

---

## 🎯 Use Cases

| Actor | Use Case | Description |
|-------|----------|-------------|
| User | Register | Create a new account with username, email, and password |
| User | Login | Authenticate using email and password |
| User | Reset Password | Reset account password using registered email |
| User | Create Community | Start a new community with a name and description |
| User | Browse Communities | Explore all available communities |
| User | Create Post | Share text posts or posts with images in a community |
| User | View Post | Read full post content with all comments |
| User | Upvote / Downvote | Vote on posts; votes can be toggled or switched |
| User | Comment | Add top-level comments to posts |
| User | Reply to Comment | Reply to any comment — nested up to 4 levels deep |
| User | Search | Search posts and communities by keyword |
| User | Sort Feed | Sort posts by newest or top voted |
| User | Upload Image | Upload images from local device when creating a post |

---

## 🛠️ Tech Stack

### Backend

| Technology | Reason |
|------------|--------|
| **Java 21** | Latest LTS version of Java — strong typing, performance, and maturity for enterprise backend development |
| **Spring Boot 4.x** | Industry-standard framework for building production-ready REST APIs with minimal configuration; provides auto-configuration, dependency injection, and a rich ecosystem |
| **Spring Security** | Provides enterprise-grade authentication and authorization; integrates seamlessly with JWT for stateless security |
| **JWT (JSON Web Tokens)** | Stateless authentication ideal for REST APIs; eliminates need for server-side sessions; tokens carry user identity securely |
| **Hibernate / JPA** | Object-Relational Mapping eliminates boilerplate SQL; provides entity relationships, lazy loading, and database abstraction |
| **Maven** | Industry-standard build tool for Java; manages dependencies, builds, and project lifecycle |
| **Lombok** | Reduces boilerplate code (getters, setters, builders, constructors) keeping entities and DTOs clean |

### Database

| Technology | Reason |
|------------|--------|
| **PostgreSQL** | Robust open-source relational database; excellent support for complex queries, relationships, and indexing |
| **Neon PostgreSQL** | Serverless PostgreSQL in the cloud — free tier, auto-scaling, and accessible from anywhere without local DB setup |

### File Storage

| Technology | Reason |
|------------|--------|
| **Cloudinary** | Cloud-based image storage and CDN; images survive deployment, load fast globally, and require no server disk management |

### Frontend

| Technology | Reason |
|------------|--------|
| **React.js** | Component-based UI library; virtual DOM for efficient updates; huge ecosystem and community |
| **React Router** | Client-side routing for single-page application navigation |
| **Tailwind CSS** | Utility-first CSS framework; enables rapid, consistent, responsive UI development without writing custom CSS |
| **Axios** | Promise-based HTTP client; interceptors enable automatic JWT injection and global error handling |
| **Context API** | Built-in React state management for global auth state — lightweight, no extra dependencies needed |

### Deployment

| Technology | Reason |
|------------|--------|
| **Render** | Simple, free-tier backend deployment with environment variable support |
| **Vercel** | Optimized for React/frontend deployments; automatic preview deployments and global CDN |

---

## 🔐 Authentication

Posta uses **JWT (JSON Web Token)** based stateless authentication.

### How It Works

```
User submits email + password
        ↓
Spring Security validates credentials via CustomUserDetailsService
        ↓
BCrypt password comparison
        ↓
JwtUtils generates signed token (HS256, 24hr expiry)
        ↓
Token returned to frontend
        ↓
Frontend stores token in localStorage
        ↓
Every API request includes: Authorization: Bearer <token>
        ↓
JwtAuthFilter intercepts → validates → sets SecurityContext
        ↓
Controller receives authenticated request
```

### Security Features

- ✅ Passwords hashed with **BCrypt** (never stored in plain text)
- ✅ JWT tokens signed with **HS256** algorithm
- ✅ All endpoints protected except `/api/auth/**`
- ✅ Token expiry: **24 hours**
- ✅ Input validation on all request DTOs (`@Valid`, `@NotBlank`, `@Email`, `@Size`)
- ✅ CORS configured for specific origins only
- ✅ Stateless session management (no cookies)

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |
| POST | `/api/auth/reset-password` | Reset password by email | ❌ |

---

## 🔄 Application Flowchart

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │     Not Logged In?      │
              └────────────┬────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
         Signup          Login      Reset Password
            │              │              │
            └──────────────▼──────────────┘
                           │
                    JWT Token Issued
                           │
              ┌────────────▼────────────┐
              │       Home Feed         │
              │  (All Posts - Sorted)   │
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Browse Feed        Search Bar        Sidebar Communities
        │                  │                  │
        │            Search Results     Community Page
        │                  │                  │
   Click Post         Posts / Communities   Create Post
        │                                     │
   Post Detail Page                    Upload Image (Cloudinary)
        │                                     │
   Read Full Post                       Post Published
        │
   ┌────┴────┐
   │         │
  Vote    Comments
   │         │
Toggle    Nested Replies
Up/Down   (up to 4 levels)
```

---

## 🌐 API Overview

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/reset-password` | Reset password |

### Communities
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/communities` | Create community |
| GET | `/api/communities` | List all communities |
| GET | `/api/communities/{slug}` | Get community by slug |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/posts?sort=new\|top` | Get all posts (sorted) |
| GET | `/api/posts/{id}` | Get post by ID |
| GET | `/api/communities/{slug}/posts?sort=new\|top` | Get posts by community |

### Votes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/votes` | Upvote or downvote |
| GET | `/api/votes/score/{postId}` | Get vote score |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments` | Add comment or reply |
| GET | `/api/posts/{id}/comments` | Get nested comments |

### Search & Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?query=` | Search posts + communities |
| POST | `/api/uploads/image` | Upload image to Cloudinary |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (React.js)           │
│         Tailwind CSS + Axios            │
│         http://localhost:3000           │
└──────────────────┬──────────────────────┘
                   │ HTTP REST (JWT)
┌──────────────────▼──────────────────────┐
│         Backend (Spring Boot)           │
│                                         │
│  Controller Layer  →  REST Endpoints    │
│  Service Layer     →  Business Logic    │
│  Repository Layer  →  JPA / Hibernate   │
│         http://localhost:8080           │
└──────────┬───────────────┬──────────────┘
           │               │
┌──────────▼───────┐ ┌─────▼──────────────┐
│  Neon PostgreSQL │ │    Cloudinary CDN  │
│  (Cloud DB)      │ │  (Image Storage)   │
└──────────────────┘ └────────────────────┘
```

---

## 💼 Industry Value of the Project

### Skills Demonstrated

| Skill | How Demonstrated |
|-------|-----------------|
| **Backend API Design** | RESTful APIs following industry naming conventions, proper HTTP status codes, and DTO patterns |
| **Database Design** | Normalized relational schema with proper entity relationships (OneToMany, ManyToOne, self-referencing for nested comments) |
| **Security Implementation** | JWT authentication, BCrypt password hashing, Spring Security filter chain, input validation |
| **Cloud Integration** | Cloudinary for image CDN, Neon PostgreSQL for serverless database |
| **Frontend Architecture** | Component-based design, protected routes, global state management, responsive UI |
| **Software Engineering Practices** | Layered architecture, separation of concerns, DTO pattern, environment-based configuration |

### Real-World Applicability

- 🏢 The **layered architecture** (Controller → Service → Repository) mirrors what is used in enterprise Java applications at companies like banks, e-commerce platforms, and SaaS products
- 🔒 The **JWT + Spring Security** setup is the industry standard for securing REST APIs
- ☁️ **Cloud-first approach** (Neon + Cloudinary + Render/Vercel) reflects modern deployment practices
- 📱 **Responsive design** ensures the application works across devices
- 🔍 **Search functionality** demonstrates query optimization with JPQL

### Portfolio Value

This project is a strong portfolio piece for:
- ☕ **Java Backend Developer** roles
- 🌐 **Full Stack Developer** roles
- 🚀 Entry to mid-level positions at product companies and service firms

---

## 🛠️ Technologies Used

### Backend Technologies
- Java 21
- Spring Boot 4.x
- Spring Security 6.x
- Spring Data JPA
- Hibernate ORM
- JWT (jjwt 0.11.5)
- Lombok
- Maven
- Cloudinary SDK

### Frontend Technologies
- React.js 18
- React Router DOM
- Tailwind CSS
- Axios
- React Context API

### Database & Cloud
- PostgreSQL
- Neon (Serverless PostgreSQL)
- Cloudinary (Image CDN)

### Tools
- IntelliJ IDEA
- VS Code
- Postman (API Testing)
- Git & GitHub
- pgAdmin / Neon Console

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+
- PostgreSQL (or Neon account)
- Cloudinary account

### Backend Setup

```bash
# Clone the repository
git clone git remote add origin https://github.com/Romal1903/reddit-clone.git
cd posta/backend

# Run the application
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd posta/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables

**Backend `.env`:**
```env
DB_URL=your_neon_postgresql_url
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRATION=86400000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SERVER_PORT=8080
```

**Frontend `.env`:**
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

---

## 📁 Project Structure

```
posta/
├── backend/
│   ├── src/main/java/com/redditclone/backend/
│   │   ├── config/          # Security, JWT, CORS, Cloudinary configs
│   │   ├── controller/      # REST API controllers
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Spring Data JPA repositories
│   │   └── service/         # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── .env                 # ← not committed
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios configuration
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Auth context
    │   └── pages/           # Page components
    ├── .env                 # ← not committed
    └── package.json
```

---

## 🔮 Future Enhancements

| Feature | Description |
|---------|-------------|
| **Real-time Updates** | WebSocket integration for live comment and vote updates |
| **Notifications** | In-app notifications for replies and votes |
| **Admin Moderation** | Admin role for managing communities and removing content |
| **Deep Nested Comments** | Beyond 4 levels with collapsible thread view |
| **User Profiles** | Extended profile with post history and karma score |
| **Email Verification** | Email confirmation on signup |
| **OAuth Login** | Google / GitHub social login |
| **Dark Mode** | Theme toggle for dark/light mode |
| **Post Bookmarks** | Save posts for later reading |
| **Community Membership** | Join/leave communities, member count |

---

## 🎓 Conclusion

**Posta** is a production-ready MVP that demonstrates the full software development lifecycle — from requirements gathering and database design, through backend API development and security implementation, to frontend integration and cloud deployment.

The project applies industry-standard technologies and patterns used in real-world applications:

- ✅ Secure, scalable **REST API** with Spring Boot
- ✅ **JWT authentication** with BCrypt password security
- ✅ **Relational database** design with proper JPA entity mapping
- ✅ **Cloud-native** image storage with Cloudinary
- ✅ **Responsive, component-based** frontend with React and Tailwind
- ✅ **Environment-based configuration** for safe secret management
- ✅ **Nested comment system** with recursive data structure

This project serves as a strong demonstration of full-stack Java development skills and is ready for use as a portfolio piece for Java Backend Developer and Full Stack Developer roles.

---

## 👨‍💻 Author

***Romal Tandel***

**Tech Stack:** Java · Spring Boot · Spring Security · JWT · PostgreSQL · React · Tailwind CSS · Cloudinary

---

*Posta — Simple. Post-centric. Global.*

**Deploy URL:** [Posta — RedditClone](https://reddit-clone-nine.vercel.app)