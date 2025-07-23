import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './AddPlantLog.css'

function AddPlantLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Action is now an array
  const [action, setAction] = useState([]);
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // Add action to list
      setAction(prev => [...prev, value]);
    } else {
      // Remove action from list
      setAction(prev => prev.filter(a => a !== value));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('plant', id);
    action.forEach(a => formData.append('action', a)); // append each action
    formData.append('note', note);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`http://localhost:8080/plant/${id}/logs`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      //navigates back to log once submitted
      navigate(`/plant/${id}/logs`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
  <div className="add-log-container">
    <h2>Add New Log</h2>
    <form className="add-log-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Actions:</legend>
        <label>
          <input
            type="checkbox"
            value="watered"
            onChange={handleCheckboxChange}
            checked={action.includes('watered')}
          />
          Watered
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="Fertilized"
            onChange={handleCheckboxChange}
            checked={action.includes('Fertilized')}
          />
          Fertilized
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            value="Repotted"
            onChange={handleCheckboxChange}
            checked={action.includes('Repotted')}
          />
          Repotted
        </label>
      </fieldset>

      <label>
        Note:
        <textarea value={note} onChange={e => setNote(e.target.value)} />
      </label>

      <label>
        Upload Image:
        <input type="file" onChange={e => setImage(e.target.files[0])} />
      </label>

      <button type="submit">Submit Log</button>
    </form>
  </div>
);
}

export default AddPlantLog;