# Mini LinkedIn-like Community Platform

A full-stack Mini LinkedIn-like Community Platform built with the MERN stack, allowing users to connect, share posts, and interact with a news feed. This application features user authentication, a customizable user profile, and a post-based feed system.

---

### Features

-   **User Authentication:** Secure user registration and login with JWT.
-   **User Profiles:** View and edit personal profiles with a bio and profile picture.
-   **Posts Feed:** View a real-time feed of posts from other users.
-   **Follow/Unfollow:** Connect with other users by following their profiles.
-   **Search Functionality:** Find users and posts via a simple search bar.

---

### Tech Stack

**Frontend:**
-   **React.js** with **Vite**
-   **Axios** for API calls
-   **React Router DOM** for navigation
-   **CSS** for styling

**Backend:**
-   **Node.js** with **Express.js**
-   **MongoDB** as the database
-   **Mongoose** for data modeling
-   **JSON Web Token (JWT)** for authentication
-   **Cloudinary** for image storage

---

### Setup and Installation

Follow these steps to set up the project on your local machine.

#### 1. Clone the Repository

```bash
git clone [https://github.com/manish-modanwal/ciaan_assignment](https://github.com/manish-modanwal/ciaan_assignment)
cd ciaan_assignment
```




### Backend Setup

Navigate to the `backend` directory, install dependencies, and create a `.env` file.

```bash
cd backend
npm install
```

### Backend `.env` File



Create a **`.env`** file in the `backend` folder and add your environment variables.

```ini
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.dggvsi7.mongodb.net/linkedin"
JWT_SECRET="your_strong_secret_key"
PORT=5000
CLOUDINARY_CLOUD_NAME="dghw7bclm"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

```

### Frontend Setup

Navigate to the `frontend` directory, install dependencies, and create a `.env` file.

```bash
cd ../frontend
npm install
```

### Frontend `.env` File

Create a **`.env`** file in the `frontend` folder. The `VITE_API_URL` should point to your local backend server.

```ini
VITE_API_URL="http://localhost:5000"
```
