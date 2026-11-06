
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [popularLoading, setPopularLoading] = useState(true)

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Registration states
  const [showRegister, setShowRegister] = useState(false)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // Fetch movies when website opens
  useEffect(() => {
    fetchMovies()
    fetchPopularMovies()
  }, [])

  // Fetch complete details of selected movie
  useEffect(() => {
    if (!selectedMovie) return

    const fetchMovieDetails = async () => {
      try {
        setDetailsLoading(true)

        const response = await fetch(
          `http://localhost:5000/api/movies/${selectedMovie.id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }

        const data = await response.json()
        setSelectedMovie(data)

      } catch (error) {
        console.log('Error fetching movie details:', error)
      } finally {
        setDetailsLoading(false)
      }
    }

    fetchMovieDetails()
  }, [selectedMovie?.id])

  // Fetch Trending Movies
  const fetchMovies = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        'http://localhost:5000/api/movies/trending'
      )

      const data = await response.json()
      setMovies(data)

    } catch (error) {
      console.log('Error fetching trending movies:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Popular Movies
  const fetchPopularMovies = async () => {
    try {
      setPopularLoading(true)

      const response = await fetch(
        'http://localhost:5000/api/movies/popular'
      )

      const data = await response.json()
      setPopularMovies(data)

    } catch (error) {
      console.log('Error fetching popular movies:', error)
    } finally {
      setPopularLoading(false)
    }
  }

  // Search Movies
  const searchMovies = async (e) => {
    e.preventDefault()

    if (!search.trim()) {
      fetchMovies()
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `http://localhost:5000/api/movies/search?q=${encodeURIComponent(search)}`
      )

      const data = await response.json()
      setMovies(data)

    } catch (error) {
      console.log('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle registration input changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target

    setRegisterData({
      ...registerData,
      [name]: value
    })

    setRegisterMessage('')
  }

  // Register new user
  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      setRegisterLoading(true)
      setRegisterMessage('')

      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setRegisterSuccess(true)
      setRegisterMessage('Account created successfully! Welcome to MovieBox.')

      setRegisterData({
        name: '',
        email: '',
        password: ''
      })

    } catch (error) {
      setRegisterSuccess(false)
      setRegisterMessage(error.message || 'Something went wrong.')
    } finally {
      setRegisterLoading(false)
    }
  }

  // Find YouTube Trailer
  const trailer = selectedMovie?.videos?.results?.find(
    (video) =>
      video.site === 'YouTube' &&
      video.type === 'Trailer' &&
      video.official
  ) || selectedMovie?.videos?.results?.find(
    (video) =>
      video.site === 'YouTube' &&
      video.type === 'Trailer'
  )

  // Reusable movie cards
  const renderMovies = (movieList) => (
    <div className="movie-grid">
      {movieList.map((movie) => (
        <div
          className="movie-card"
          key={movie.id}
          onClick={() => setSelectedMovie(movie)}
        >
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://placehold.co/500x750?text=No+Poster'
            }
            alt={movie.title}
          />

          <h3>{movie.title}</h3>

          <p>
            {movie.release_date
              ? movie.release_date.slice(0, 4)
              : 'Release date unavailable'}
          </p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">
          MOVIE<span>BOX</span>
        </h1>

        <form className="search-form" onSubmit={searchMovies}>
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <button
          className="signup-button"
          onClick={() => {
            setShowRegister(!showRegister)
            setRegisterMessage('')
            setRegisterSuccess(false)
          }}
        >
          {showRegister ? 'Close' : 'Sign Up'}
        </button>
      </nav>

      {/* Registration Page */}
      {showRegister ? (

        <section className="auth-section">

          <div className="auth-container">

            <h1>Create Your Account</h1>

            <p>Join MovieBox and discover your next favourite movie.</p>

            <form onSubmit={handleRegister}>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password (minimum 6 characters)"
                value={registerData.password}
                onChange={handleRegisterChange}
                minLength="6"
                required
              />

              <button type="submit" disabled={registerLoading}>
                {registerLoading ? 'Creating Account...' : 'Create Account'}
              </button>

            </form>

            {registerMessage && (
              <p
                className={
                  registerSuccess
                    ? 'success-message'
                    : 'error-message'
                }
              >
                {registerMessage}
              </p>
            )}

          </div>

        </section>

      ) : selectedMovie ? (

        /* Movie Details Page */
        <section className="movie-details">

          <button onClick={() => setSelectedMovie(null)}>
            ← Back to Movies
          </button>

          {detailsLoading ? (
            <p>Loading movie details...</p>
          ) : (
            <>

              <div className="details-content">

                <img
                  src={
                    selectedMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                      : 'https://placehold.co/500x750?text=No+Poster'
                  }
                  alt={selectedMovie.title}
                />

                <div>
                  <h1>{selectedMovie.title}</h1>

                  <p>
                    Release Date: {selectedMovie.release_date || 'Not available'}
                  </p>

                  <p>
                    Rating: ⭐ {selectedMovie.vote_average?.toFixed(1) || 'N/A'}/10
                  </p>

                  <h3>Overview</h3>

                  <p>
                    {selectedMovie.overview || 'No overview available.'}
                  </p>

                </div>

              </div>

              {/* Cast Section */}
              <div className="cast-section">

                <h3>Cast</h3>

                <div className="cast-grid">

                  {selectedMovie.credits?.cast?.slice(0, 6).map((actor) => (
                    <div className="cast-card" key={actor.id}>

                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : 'https://placehold.co/200x300?text=No+Image'
                        }
                        alt={actor.name}
                      />

                      <h4>{actor.name}</h4>
                      <p>{actor.character}</p>

                    </div>
                  ))}

                </div>
              </div>

              {/* Trailer Section */}
              {trailer ? (
                <div className="trailer-section">

                  <h3>Official Trailer</h3>

                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Movie Trailer"
                    allowFullScreen
                  ></iframe>

                </div>
              ) : (
                <p className="no-trailer">
                  No trailer available for this movie.
                </p>
              )}

            </>
          )}

        </section>

      ) : (

        /* Homepage */
        <main>

          {/* Hero Section */}
          <section className="hero">

            <p className="hero-label">
              YOUR CINEMA, YOUR WAY
            </p>

            <h2>
              Discover your next favourite movie.
            </h2>

            <p>
              Explore trending movies and find something worth watching.
            </p>

          </section>

          {/* Trending Movies */}
          <section className="movies-section">

            <h2>
              {search.trim()
                ? `Search Results for "${search}"`
                : 'Trending Movies'}
            </h2>

            {loading ? (
              <p>Loading movies...</p>
            ) : movies.length === 0 ? (
              <p>No movies found. Try another search.</p>
            ) : (
              renderMovies(movies)
            )}

          </section>

          {/* Popular Movies */}
          {!search.trim() && (
            <section className="movies-section">

              <h2>Popular Movies</h2>

              {popularLoading ? (
                <p>Loading popular movies...</p>
              ) : popularMovies.length === 0 ? (
                <p>No popular movies available.</p>
              ) : (
                renderMovies(popularMovies)
              )}

            </section>
          )}

        </main>

      )}

    </div>
  )
}

export default App
