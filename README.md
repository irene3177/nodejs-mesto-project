# 🖼️ Mesto - Backend API

## 📋 About The Project

**Mesto** is a RESTful API backend for a photo-sharing social platform where users can share images, like posts, and edit their profiles. This project was developed as part of a backend development course, demonstrating fundamental backend development skills with Node.js, Express, MongoDB, and TypeScript.

### ✨ Key Features

- **👥 User Management** - Create, read, and update user profiles with avatars
- **🖼️ Photo Cards** - Create, view, and delete image cards
- **❤️ Likes System** - Add or remove likes from cards
- **🛡️ Error Handling** - Comprehensive error responses with appropriate status codes
- **💾 Database Integration** - MongoDB with Mongoose ODM

## 🏗️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Node.js 20.x |
| **Framework** | Express 4.x |
| **Language** | TypeScript 5.x |
| **Database** | MongoDB 6.x |
| **ODM** | Mongoose 7.x |
| **Linting** | ESLint (Airbnb style guide) |
| **Dev Tools** | ts-node-dev (hot reload) |

## 📊 Database Schema

### User Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| name | string | required, 2-30 chars | User's display name |
| about | string | required, 2-200 chars | User biography |
| avatar | string | required, URL | Profile picture URL |
| \_id | ObjectId | auto-generated | Unique identifier |

### Card Schema

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| name | string | required, 2-30 chars | Card title |
| link | string | required, URL | Image URL |
| owner | ObjectId | required, ref: 'user' | Card creator |
| likes | ObjectId[] | default: [] | Users who liked the card |
| createdAt | Date | default: Date.now | Creation timestamp |
| \_id | ObjectId | auto-generated | Unique identifier |

## 🔌 API Endpoints

### Users

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/users` | Get all users | 200, 500 |
| GET | `/users/:userId` | Get user by ID | 200, 404, 500 |
| POST | `/users` | Create new user | 201, 400, 500 |
| PATCH | `/users/me` | Update user profile | 200, 400, 404, 500 |
| PATCH | `/users/me/avatar` | Update user avatar | 200, 400, 404, 500 |

### Cards

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/cards` | Get all cards | 200, 500 |
| POST | `/cards` | Create new card | 201, 400, 500 |
| DELETE | `/cards/:cardId` | Delete card by ID | 200, 404, 500 |
| PUT | `/cards/:cardId/likes` | Add like to card | 200, 400, 404, 500 |
| DELETE | `/cards/:cardId/likes` | Remove like from card | 200, 400, 404, 500 |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 6+ (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/irene3177/nodejs-mesto-project.git
cd mesto-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017`
The database `mestodb` will be created automatically.

4. Create `.env` file

```env
JWT_SECRET='super-secret-key'
MONGO_URL = "mongodb://localhost:27017/mestodb"
PORT = "3001"
```

5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🧪 Testing with Postman

### Create a Test User

**POST** `http://localhost:3001/users`

```json
{
  "name": "John Doe",
  "about": "Photography enthusiast",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Create a Card

**POST** `http://localhost:3001/cards`

```json
{
  "name": "Beautiful Sunset",
  "link": "https://example.com/sunset.jpg"
}
```

### Like a Card

**PUT** `http://localhost:3001/cards/:cardId/likes`

### Get All Users

**GET** `http://localhost:3001/users`

## 📋 Error Responses

All errors follow a consistent format:

```json
{
  "message": "Error description here"
}
```

| StatusCode | Description |
|------------|-------------|
| 400 | Bad Request - Invalid data provided |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Default error |

---
**Built with Node.js, Express, MongoDB, and TypeScript as part of backend development course**
