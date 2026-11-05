const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());

const TMDB_BASE = "https://api.themoviedb.org/3";
const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: process.env.TMDB_API_KEY },
});

// Get trending movies this week
app.get("/api/movies/trending", async (req, res) => {
  const { data } = await tmdb.get("/trending/movie/week");
  res.json(data.results);
});

// Get popular movies
app.get("/api/movies/popular", async (req, res) => {
  const { data } = await tmdb.get("/movie/popular");
  res.json(data.results);
});

// Search movies by title
app.get("/api/movies/search", async (req, res) => {
  const { data } = await tmdb.get("/search/movie", {
    params: { query: req.query.q },
  });
  res.json(data.results);
});

// Get one movie's full details (cast + trailer included)
app.get("/api/movies/:id", async (req, res) => {
  const { data } = await tmdb.get(`/movie/${req.params.id}`, {
    params: { append_to_response: "credits,videos" },
  });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));