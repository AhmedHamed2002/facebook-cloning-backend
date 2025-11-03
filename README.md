# 📱 Facebook Clone Backend (Node.js + Express + MongoDB)

This project is a backend API built with **Express.js** and **MongoDB**, designed to simulate a Facebook-like social platform.  
It supports **user authentication**, **friend requests**, **posts**, **comments**, **reactions**, and **profile image uploads** — all protected with **JWT tokens** and validated with middleware.

---

## 🚀 Features

### 👤 User Management
- Register, login, and logout with JWT authentication.
- Upload profile and background images.
- Update and view user profile.
- Forgot/reset password system.
- Search for users.
- Get all users or a single user by ID.

### 📝 Posts
- Create, edit, delete, and view posts.
- Upload post images.
- View all public posts or posts from friends.
- Get posts by specific users.

### 💬 Comments
- Add and delete comments on posts.
- View all comments for a post.

### ❤️ Reactions
- Add, remove, and get reactions (like/dislike) for a post.

### 🤝 Friendships
- Send, accept, reject, and remove friend requests.
- Validation ensures secure and consistent request handling.

---

## 🧩 Technologies Used

- **Node.js** & **Express.js** — Backend framework
- **MongoDB** & **Mongoose** — Database & ORM
- **JWT (JSON Web Tokens)** — Authentication
- **Multer** — File upload handling
- **Express Validator** — Data validation
- **dotenv** — Environment configuration
- **CORS** — Cross-origin resource sharing

---

## 📂 Folder Structure

   ```bash
   project-root/
   ├── controller/
   │ ├── user.controller.js
   │ ├── post.controller.js
   │ ├── comment.controller.js
   │ ├── friendship.controller.js
   │ └── reaction.controller.js
   │
   ├── middleware/
   │ ├── verifyToken.js
   │ ├── user_validation.js
   │ ├── post_validation.js
   │ ├── comment_validation.js
   │ ├── reaction_validation.js
   │ ├── friendship_validation.js
   │ └── user_image_validation.js
   │
   ├── routes/
   │ ├── user.route.js
   │ ├── post.route.js
   │ ├── comment.route.js
   │ ├── friend.route.js
   │ └── reaction.route.js
   │
   ├── utils/
   │ └── httpStatusText.js
   │
   ├── .env
   ├── server.js
   └── package.json

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/facebook-backend.git
   cd facebook-backend

2. **Install dependencies**
   npm install

3. **Create .env file**
  PORT=4000
  MONGO_URL=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret

4. **Run the server**
  npm start


---

## 📡 API Endpoints Overview

1. **👤 User Routes**
   
| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| `POST` | `/facebook/user/register` | Register a new user (with image upload) |
| `POST` | `/facebook/user/login`    | User login                              |
| `GET`  | `/facebook/user/check`    | Check token validity                    |
| `GET`  | `/facebook/user/profile`  | Get current user profile                |
| `PUT`  | `/facebook/user/profile`  | Update profile with images              |
| `GET`  | `/facebook/user/search`   | Search for users                        |
| `GET`  | `/facebook/user/:id`      | Get user by ID                          |

2. **📝 Post Routes**

| Method   | Endpoint                      | Description          |
| -------- | ----------------------------- | -------------------- |
| `POST`   | `/facebook/post/`             | Create a new post    |
| `PUT`    | `/facebook/post/`             | Edit a post          |
| `GET`    | `/facebook/post/all`          | Get all public posts |
| `GET`    | `/facebook/post/friends`      | Get friends’ posts   |
| `GET`    | `/facebook/post/user/:userId` | Get user’s posts     |
| `GET`    | `/facebook/post/:postId`      | Get a single post    |
| `DELETE` | `/facebook/post/:postId`      | Delete a post        |


3. **💬 Comment Routes**

| Method   | Endpoint                                | Description             |
| -------- | --------------------------------------- | ----------------------- |
| `GET`    | `/facebook/comments/:postId`            | Get comments for a post |
| `POST`   | `/facebook/comments/:postId`            | Add a comment           |
| `DELETE` | `/facebook/comments/:postId/:commentId` | Delete a comment        |


4. **❤️ Reaction Routes**
   
| Method   | Endpoint                     | Description              |
| -------- | ---------------------------- | ------------------------ |
| `POST`   | `/facebook/reaction/`        | Add a reaction           |
| `DELETE` | `/facebook/reaction/`        | Remove a reaction        |
| `GET`    | `/facebook/reaction/:postId` | Get reactions for a post |


5. **🤝 Friendship Routes**

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| `POST` | `/facebook/friend/request` | Send a friend request   |
| `POST` | `/facebook/friend/accept`  | Accept a friend request |
| `POST` | `/facebook/friend/reject`  | Reject a friend request |
| `POST` | `/facebook/friend/remove`  | Remove a friend         |


---

## 🧑‍💻 Author

Ahmed Hamed
Frontend Developer & Backend Enthusiast
📍 Al-Azhar University — Engineering Student
💻 Specializing in React, Angular, and Express.js




