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

  const handleDelete = async (meetingId) => {
    const confirmDelete = window.confirm('Es-tu sûr de vouloir supprimer cette réunion ?');
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.access;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      await axios.delete(`http://localhost:8000/meetings/reunions/${meetingId}/`, config);

      setMeetings(prevMeetings => prevMeetings.filter(m => m._id !== meetingId));

      alert('Réunion supprimée avec succès.');
    } catch (error) {
      console.error('Erreur suppression réunion:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-lg">Chargement des réunions...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Mes Réunions</h2>

      {meetings.length === 0 ? (
        <p className="text-center">Aucune réunion trouvée.</p>
      ) : (
        <ul className="space-y-6">
          {meetings.map((meeting) => (
            <li key={meeting._id} className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-2">{meeting.title}</h3>
              <p className="text-gray-600">Date: {new Date(meeting.date).toLocaleString()}</p>
              <p className="text-gray-600 mb-4">Langue: {meeting.language}</p>

              <audio controls className="w-full mt-2 mb-4">
                <source src={`http://localhost:8000/${meeting.audio_file_path}`} type="audio/mpeg" />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>

              <div className="flex gap-4">
                <a 
                  href={`http://localhost:8000/${meeting.audio_file_path}`} 
                  download 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Télécharger
                </a>

                <button 
                  onClick={() => handleDelete(meeting._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
