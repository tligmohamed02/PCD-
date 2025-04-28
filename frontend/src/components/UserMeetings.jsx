import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.access;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        };
        const response = await axios.get('http://localhost:8000/meetings/user-reunions/', config);
        setMeetings(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réunions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return <div>Chargement des réunions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Réunions</h2>

      {meetings.length === 0 ? (
        <p>Aucune réunion trouvée.</p>
      ) : (
        <ul className="space-y-2">
  {meetings.map((meeting) => (
    <li key={meeting._id} className="p-4 border rounded shadow">
      <h3 className="text-xl font-semibold">{meeting.title}</h3>
      <p>Date: {new Date(meeting.date).toLocaleString()}</p>
      <p>Langue: {meeting.language}</p>

      <audio controls className="w-full mt-2">
        <source src={`http://localhost:8000/${meeting.audio_file_path}`} type="audio/mpeg" />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>

    </li>
  ))}
</ul>
      )}
    </div>
  );
}
