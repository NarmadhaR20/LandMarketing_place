# LandMarketplace

LandMarketplace is a comprehensive platform designed to facilitate secure and transparent land transactions between verified landowners and prospective buyers. The platform connects buyers and sellers while providing an administrative layer for vetting properties and ensuring platform integrity.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS for responsive and modern UI
- **Icons**: Lucide React
- **Network Requests**: Axios
- **State Management**: React Context API (`AuthContext` for user sessions)

### Backend
- **Framework**: Java 17 + Spring Boot 3
- **Security**: Spring Security + JWT authentication
- **ORM / Database Access**: Spring Data JPA & Hibernate
- **Database**: MySQL Server
- **Build Tool**: Maven

---

## 🏗️ Project Structure

The project is structured as a monorepo containing both the frontend and backend applications separately:

```
LandMarketplace/
│
├── Landmarket-frontend/        # React Client Application
│   ├── src/
│   │   ├── api/                # Axios instances and API services (authService)
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, Modals)
│   │   ├── context/            # React Contexts (AuthContext)
│   │   ├── pages/              # Pages grouped by role (admin, buyer, owner, public)
│   │   └── App.jsx             # Main router and route definitions
│   ├── package.json
│   └── tailwind.config.js
│
└── Landmarket-backend/         # Spring Boot Server Application
    ├── src/main/java/com/marketplace/landmarketplace/
    │   ├── config/             # Security and CORS configurations
    │   ├── controller/         # REST API Controllers (Auth, Land, User, Booking)
    │   ├── dto/                # Data Transfer Objects for API requests/responses
    │   ├── enums/              # Enum classes (Role, LandStatus, LandType)
    │   ├── model/              # JPA Entities matching the database schema
    │   ├── repository/         # Spring Data JPA Repository interfaces
    │   └── service/            # Business logic and transaction handling
    └── pom.xml
```

---

## 🗄️ Database Schema

The application relies on a relational MySQL database with the following core entities:

1. **`users`**: 
   - Stores account information, hashed passwords, contact details, and assigned Roles (`BUYER`, `OWNER`, `ADMIN`).
2. **`lands`**: 
   - Stores the property listings. Includes fields for Title, Location, Area, Area Unit, Price, description, and an Image blob.
   - Tied to an owner (ManyToOne relationship with `users`).
   - Tracks the `LandStatus` (`PENDING`, `AVAILABLE`, `UNDER_CONTRACT`, `REJECTED`).
3. **`bookings`**: 
   - Represents a buyer's interest requests on specific lands.
   - Links the `buyer_id` (User) to the `land_id` (Land).
   - Tracks the Booking Status (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`).
4. **`reports`**: 
   - Allows buyers to flag suspicious or fraudulent `AVAILABLE` listings.
   - Links the `buyer_id` (User) that submitted the issue to the `land_id` (Land) in question.

---

## 📡 API Endpoints 

The backend exposes RESTful endpoints, secured via JWT. Common endpoints include:

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and return JWT token
- `POST /api/auth/profile` - Complete user profile details

### 🗺️ Land Management (`/api/lands`)
- `GET  /api/lands` - Get all lands (Admin visibility)
- `GET  /api/lands/approved` - Get all public/Available lands (Public/Buyer visibility)
- `GET  /api/lands/my-lands` - Get logged-in owner's lands
- `POST /api/lands` - Owner submits a new land (Starts as `PENDING`)
- `PUT  /api/lands/{id}/approve` - Admin approves a land
- `PUT  /api/lands/{id}/reject` - Admin rejects a land

### 🤝 Booking Management (`/api/bookings`)
- `POST /api/bookings/land/{id}` - Buyer submits an interest request on a land
- `GET  /api/bookings/my-bookings` - Buyer views their requests
- `GET  /api/bookings/owner-requests` - Owner views incoming leads for their land
- `PUT  /api/bookings/{id}/approve` - Owner accepts the buyer's lead

### 🛡️ Community Integrity (`/api/reports`)
- `POST /api/reports/buyer/{buyerId}/land/{landId}` - Buyer reports a suspicious listing

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Java JDK (v17+)
- Maven
- MySQL Server

### 1. Database Configuration
1. Open MySQL and create a database named `landmarketplace`.
2. Navigate to `Landmarket-backend/src/main/resources/application.properties`.
3. Update the database url, username, and password to match your local MySQL configuration.

### 2. Running the Backend
1. Open a terminal and navigate to the backend directory: `cd Landmarket-backend`
2. Run the Spring Boot application using Maven: `mvn spring-boot:run`
3. The backend will start and run on `http://localhost:8080`.

### 3. Running the Frontend
1. Open a new terminal and navigate to the frontend directory: `cd Landmarket-frontend`
2. Install the dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. The frontend will be available at `http://localhost:5173`.
