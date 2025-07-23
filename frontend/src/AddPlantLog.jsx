import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function AddPlantLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState('watered');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('plant', id);
    formData.append('action', action);
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

      // Redirect back to plant logs page after submission
      navigate(`/plant/${id}/logs`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Add New Log</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Action:
          <select value={action} onChange={e => setAction(e.target.value)}>
            <option value="watered">Watered</option>
            <option value="Fertilized">Fertilized</option>
            <option value="Repotted">Repotted</option>
          </select>
        </label>
        <br />
        <label>
          Note:
          <textarea value={note} onChange={e => setNote(e.target.value)} />
        </label>
        <br />
        <label>
          Upload Image:
          <input type="file" onChange={e => setImage(e.target.files[0])} />
        </label>
        <br />
        <button type="submit">Submit Log</button>
      </form>
    </div>
  );
}

export default AddPlantLog;