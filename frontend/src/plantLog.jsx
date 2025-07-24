import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './plantLog.css';

function PlantLog() {
  const { id } = useParams(); 
  const [logs, setLogs] = useState([]);
  const [plantName, setPlantName] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/plant/${id}/logs`, {
          headers: { Authorization: token },
        });

        if (response.data.length > 0) {
          setPlantName(response.data[0].plant.plantName);
        }

        //Sort logs newest to oldest using date 
        const sortedLogs = [...response.data].sort((a, b) => {
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        });

        setLogs(sortedLogs);
      } catch (err) {
        console.error(err);
      }
    }

    fetchLogs();
  }, [id]);

  return (
    <div>
      <h2>{plantName} - Log History</h2>

      <button onClick={() => navigate(`/plant/${id}/add-log`)}>
        Add New Log
      </button>

      {logs.length === 0 && <p>No logs available.</p>}

      {logs.map(log => (
        <div key={log._id} className="log-entry">
          {log.imageUrls && log.imageUrls.length > 0 && (
  <div className="log-image">
    {log.imageUrls.map((url, index) => (
      <img
        key={index}
        src={url}
        alt={`Log image ${index + 1}`}
        className="log-thumbnail"
      />
    ))}
  </div>
)}

          <div className="log-details">
            <p><strong>Date:</strong> {new Date(log.date || log.createdAt).toLocaleDateString()}</p>
            <p><strong>Actions:</strong> {Array.isArray(log.action) ? log.action.join(', ') : log.action}</p>
            {log.note && <p><strong>Note:</strong> {log.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlantLog;