import React, { useState } from 'react';
import axios from 'axios';

export default function MeetingUpload() {
  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('fr');
  const [type, setType] = useState('public'); // 🔹 état ajouté

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('title', title);
    formData.append('language', language);
    formData.append('type', type); // 🔹 ajouter au FormData

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.access;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post('http://localhost:8000/meetings/upload-audio/', formData, config);
      console.log(response.data);
      alert('Audio uploadé avec succès !');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert("Erreur lors de l'upload");
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">Uploader une Réunion</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            placeholder="Titre de la réunion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
          <input
            type="text"
            placeholder="Langue (ex: fr, en)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="public">Publique</option>
            <option value="confidential">Confidentielle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fichier Audio</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}