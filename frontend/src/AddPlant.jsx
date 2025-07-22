import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPlant.css';

function AddPlant() {
  const navigate = useNavigate();
  const [plantName, setPlantName] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [Sunlight, setSunlight] = useState('Full Sunlight');
  const [whenToWater, setWhenToWater] = useState('Daily');
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('plantName', plantName);
      formData.append('fertilizer', fertilizer);
      formData.append('Sunlight', Sunlight);
      formData.append('whenToWater', whenToWater);

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch('http://localhost:8080/plant', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create plant');
      }

      const data = await response.json();
      console.log('Plant created:', data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addplant-container">
      <h2>Add a New Plant</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="addplant-form" encType="multipart/form-data">
        <label htmlFor="name">Plant Name:</label>
        <input
          type="text"
          id="name"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          required
        />

        <label htmlFor="fertilizer">Fertilizer:</label>
        <input
          type="text"
          id="fertilizer"
          value={fertilizer}
          onChange={(e) => setFertilizer(e.target.value)}
        />

        <label htmlFor="sunlight">Sunlight:</label>
        <select
          id="sunlight"
          value={Sunlight}
          onChange={(e) => setSunlight(e.target.value)}
        >
          <option value="Full Sunlight">Full Sunlight</option>
          <option value="Partial Sunlight">Partial Sunlight</option>
          <option value="Shade">Shade</option>
        </select>

        <label htmlFor="water">When to Water:</label>
        <select
          id="water"
          value={whenToWater}
          onChange={(e) => setWhenToWater(e.target.value)}
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Biweekly">Biweekly</option>
        </select>

        <label htmlFor="photo">Photo:</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Plant'}
        </button>
      </form>
    </div>
  );
}

export default AddPlant;