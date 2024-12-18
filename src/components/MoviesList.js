
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import "./MoviesList.css";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({ title: "", rating: "" });
  const [actors, setActors] = useState([]);
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("https://localhost:7062/api/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      }
    };
    fetchMovies();
  }, []);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewMovie({ title: "", rating: "" });
  };

  const openEditModal = (movie) => {
    setCurrentMovie(movie);
    setNewMovie({ title: movie.title, rating: movie.rating });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setNewMovie({ title: "", rating: "" });
  };

  const openDeleteConfirm = (movie) => {
    setCurrentMovie(movie);
    setIsDeleteConfirmOpen(true);
  };
  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const openActorModal = async (movieId) => {
    try {
      const response = await api.get(`https://localhost:7062/api/Movies/${movieId}/Actors`);
      setActors(response.data);
      setIsActorModalOpen(true);
    } catch (error) {
      console.error("Error fetching actors:", error.message);
    }
  };
  const closeActorModal = () => {
    setIsActorModalOpen(false);
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("https://localhost:7062/api/movies", newMovie);
      setMovies((prevMovies) => [...prevMovies, response.data]);
      closeCreateModal();
    } catch (error) {
      console.error("Error creating movie:", error.message);
    }
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.api(`https://localhost:7062/api/movies/${currentMovie.id}`, newMovie);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === currentMovie.id ? { ...movie, ...response.data } : movie
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error editing movie:", error.message);
    }
  };

  const handleDeleteMovie = async () => {
    try {
      await api.delete(`https://localhost:7062/api/movies/${currentMovie.id}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== currentMovie.id));
      closeDeleteConfirm();
    } catch (error) {
      console.error("Error deleting movie:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1 className="title">Movies</h1>
      <button className="createButton" onClick={openCreateModal}>
        Create Movie
      </button>
      <button className="viewMoviesButton" onClick={() => navigate("/actors")}>
        Go To Actors
      </button>
      <ul className="list">
        {movies.map((movie) => (
          <li key={movie.id} className="movieItem">
            <div className="movieInfo">
              <span className="movieTitle">{movie.title}</span>
              <span className="movieRating">Rating: {movie.rating}</span>
            </div>
            <div className="actionButtons">
              <button className="editButton" onClick={() => openEditModal(movie)}>Edit</button>
              <button className="deleteButton" onClick={() => openDeleteConfirm(movie)}>Delete</button>
              <button className="viewMoviesButton" onClick={() => openActorModal(movie.id)}>View Actors</button>
            </div>
          </li>
        ))}
      </ul>
      {/* Create Movie Modal */}
      {isCreateModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Create Movie</h2>
            <form onSubmit={handleCreateMovie}>
              <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMovie.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={newMovie.rating}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  required
                />
              </div>
              <div className="formActions">
                <button type="submit" className="submitButton">Save</button>
                <button type="button" className="closeModalButton" onClick={closeCreateModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Movie Modal */}
      {isEditModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Edit Movie</h2>
            <form onSubmit={handleEditMovie}>
              <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newMovie.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={newMovie.rating}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  required
                />
              </div>
              <div className="formActions">
                <button type="submit" className="submitButton">Save</button>
                <button type="button" className="closeModalButton" onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete "{currentMovie?.title}"?</p>
            <div className="formActions">
              <button onClick={handleDeleteMovie} className="submitButton deleteButton">Yes, Delete</button>
              <button onClick={closeDeleteConfirm} className="closeModalButton">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isActorModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <ul className="list">
              {actors.map(actor => (
                <li className="actorItem">
                  <span className="actorName">{actor.name}</span>
                </li>
              ))}
            </ul>
            <button className="closeModalButton" onClick={closeActorModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesList;