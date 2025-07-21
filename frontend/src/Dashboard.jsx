import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const placeholder = ['/public/plantDrawing.jpg']

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlants() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/user/plants', {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }

        const data = await response.json();
        setPlants(data);
      } catch (e) {
        setError(e.message);
      }
    }

    fetchPlants();
  }, []);

  const handlePlantClick = (plantId) => {
    // Navigate to the plant detail page, passing the plant ID
    navigate(`/plant/${plantId}`);
  };

  return (
    <div className="dashboard-container">
      <h1>Your Plants</h1>
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
              src={plant.photoUrl || '/plantDrawing.jpg'} 
              alt={plant.name}
              className="plant-photo"
            />
            <p className="plant-name">{plant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;