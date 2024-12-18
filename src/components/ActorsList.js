import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./ActorsList.css";

const ActorsList = () => {
  const [actors, setActors] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoviesModalOpen, setIsMoviesModalOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [newActor, setNewActor] = useState({ name: "" });
  const [editActor, setEditActor] = useState({ id: null, name: "" });
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadActors();
  }, []);

  const loadActors = async () => {
    try {
      const response = await api.get("https://localhost:7062/api/actors");
      setActors(response.data);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("https://localhost:7062/api/actors", newActor);
      setIsCreateModalOpen(false);
      setNewActor({ name: "" });
      loadActors();
    } catch (error) {
      console.error("Error creating actor:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await api.put(`https://localhost:7062/api/actors/${editActor.id}`, editActor);
      setIsEditModalOpen(false);
      loadActors();
    } catch (error) {
      console.error("Error editing actor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this actor?")) {
      try {
        await api.delete(`https://localhost:7062/api/actors/${id}`);
        loadActors();
      } catch (error) {
        console.error("Error deleting actor:", error);
      }
    }
  };

  const viewMovies = async (actorId) => {
    try {
      const response = await api.get(`https://localhost:7062/api/actors/${actorId}/movies`);
      setMovies(response.data);
      setSelectedActor(actors.find(actor => actor.id === actorId));
      setIsMoviesModalOpen(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Actors List</h1>
      <button className="createButton" onClick={() => setIsCreateModalOpen(true)}>
        Create Actor
      </button>

      <button className="viewMoviesButton" onClick={() => navigate("/movies")}>
        Go To Movies
      </button>

      <ul className="list">
        {actors.map((actor) => (
          <li key={actor.id} className="actorItem">
            <div className="actorInfo">
              <span className="actorName">{actor.name}</span>
            </div>
            <div className="actionButtons">
              <button
                className="editButton"
                onClick={() => {
                  setEditActor(actor);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </button>
              <button className="deleteButton" onClick={() => handleDelete(actor.id)}>
                Delete
              </button>
              <button className="viewMoviesButton" onClick={() => viewMovies(actor.id)}>
                View Movies
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Movies Modal */}
      {isMoviesModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Movies for Actor: {selectedActor?.name}</h2>
            <ul>
              {movies.map((movie) => (
                <li key={movie.id}>{movie.title}</li>
              ))}
            </ul>
            <button className="closeModalButton" onClick={() => setIsMoviesModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Create Actor</h2>
            <div className="formGroup">
              <label>Name:</label>
              <input
                type="text"
                value={newActor.name}
                onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
              />
            </div>
            <div className="formActions">
              <button className="submitButton" onClick={handleCreate}>
                Submit
              </button>
              <button className="closeModalButton" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Edit Actor</h2>
            <div className="formGroup">
              <label>Name:</label>
              <input
                type="text"
                value={editActor.name}
                onChange={(e) => setEditActor({ ...editActor, name: e.target.value })}
              />
            </div>
            <div className="formActions">
              <button className="submitButton" onClick={handleEdit}>
                Save
              </button>
              <button className="closeModalButton" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorsList;
