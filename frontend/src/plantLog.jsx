import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PlantLog() {
  const { id } = useParams(); // plant ID
  const [logs, setLogs] = useState([]);
  const [plantName, setPlantName] = useState('');
  const navigate = useNavigate(); // ✅ This must be INSIDE the component

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
        setLogs(response.data);
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
        <div key={log._id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '1rem' }}>
            {log.imageUrls && log.imageUrls[0] && (
              <img src={log.imageUrls[0]} alt="log" width={200} />
            )}
          </div>
          <div>
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Date:</strong> {new Date(log.Date).toLocaleDateString()}</p>
            {log.note && <p><strong>Note:</strong> {log.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlantLog;