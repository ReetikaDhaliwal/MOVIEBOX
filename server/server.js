
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const TMDB_BASE = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
  family: 4,
  timeout: 15000,
});

// ---------------- AUTHENTICATION ROUTES ----------------

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});


// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send successful response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ---------------- MOVIE ROUTES ----------------


const handleRequest = async (req, res, endpoint, params = {}) => {
  try {
    const { data } = await tmdb.get(endpoint, { params });
    res.json(data.results || data);
  } catch (error) {
    console.error("TMDB Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch movies from TMDB",
      error: error.message,
    });
  }
};

app.get("/api/movies/trending", (req, res) => {
  handleRequest(req, res, "/trending/movie/week");
});

app.get("/api/movies/popular", (req, res) => {
  handleRequest(req, res, "/movie/popular");
});

app.get("/api/movies/search", (req, res) => {
  handleRequest(req, res, "/search/movie", {
    query: req.query.q,
  });
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const { data } = await tmdb.get(`/movie/${req.params.id}`, {
      params: {
        append_to_response: "credits,videos",
      },
    });

    res.json(data);
  } catch (error) {
    console.error("Movie Details Error:", error.message);

    res.status(500).json({
      message: "Unable to fetch movie details",
      error: error.message,
    });
  }
});

// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

startServer();
