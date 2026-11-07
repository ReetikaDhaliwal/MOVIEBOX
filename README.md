# 🎬 CineVerse — Your Universe of Cinema

CineVerse is a full-stack movie discovery platform where users can explore trending movies, discover popular films, search for their favourite titles, and create an account.

Built with React, Node.js, Express, MongoDB and The Movie Database (TMDB) API.

## ✨ Features

- 🎥 Browse trending movies
- 🔥 Explore popular movies
- 🔍 Search movies by title
- 🎞️ View movie details
- 🔐 User registration and login
- 🔒 Password hashing using bcrypt
- 🗄️ Store user accounts in MongoDB
- 📱 Responsive movie discovery interface

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB Atlas
- Mongoose

**Authentication & APIs**
- JWT
- bcryptjs
- TMDB API

## 📁 Project Structure

```text
CineVerse/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── models/
│   │   └── user.js
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ReetikaDhaliwal/MOVIEBOX.git
cd MOVIEBOX
```

### 2. Setup the frontend

```bash
cd client
npm install
npm run dev
```

### 3. Setup the backend

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the server folder and configure:

```env
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Start the backend:

```bash
node server.js
```

## 🔗 API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/trending` | Trending movies |
| GET | `/api/movies/popular` | Popular movies |
| GET | `/api/movies/search` | Search movies |
| GET | `/api/movies/:id` | Movie details |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

## 🔑 Environment Variables

The backend requires:
- TMDB API key
- MongoDB connection URI
- JWT secret
- Server port

Never upload your `.env` file or expose your API keys and credentials.

## 🚀 Future Improvements

- Movie watchlists and favourites
- User profile dashboard
- Movie reviews and ratings
- Advanced genre-based filtering
- Deployment and production optimization

## 👩‍💻 Author

**Reetika Dhaliwal**

GitHub: [@ReetikaDhaliwal](https://github.com/ReetikaDhaliwal)

---

*Discover. Explore. Experience Cinema.*

**CineVerse — Your Universe of Cinema.**