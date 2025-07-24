import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlants() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:8080/user/plants', {
          headers: {
            Authorization: token,
          },
        });

        setPlants(response.data);
      } catch (e) {
        setError('Failed to load plants');
        console.error(e);
      }
    }

    fetchPlants();
  }, []);

  const handlePlantClick = (plantId) => {
    navigate(`/plant/${plantId}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Your Plants</h1>

      <button className="add-plant-button" onClick={() => navigate('/addingplant')}>
        Add Plant
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="plant-grid">
        {plants.map((plant) => (
          <div
            key={plant._id}
            className="plant-card"
            onClick={() => handlePlantClick(plant._id)}
            style={{ cursor: 'pointer' }} 
          >
            <img
              src={plant.photo || '/plantDrawing.jpg'}
              alt={plant.plantName}
              className="plant-photo"
              onClick={() => navigate(`/plant/${plant._id}`)}
          style={{ cursor: 'pointer', width: 200 }}
            />
            <p className="plant-name">{plant.plantName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;