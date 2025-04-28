import React, { useState } from 'react';
import axios from 'axios';

export default function MeetingUpload() {
  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('fr');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('title', title);
    formData.append('language', language);

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token; // si tu stockes un token
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
      alert('Erreur lors de l\'upload');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Uploader une Réunion</h2>

      <input
        type="text"
        placeholder="Titre de la réunion"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input mb-2"
        required
      />

      <input
        type="text"
        placeholder="Langue (ex: fr, en)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="input mb-2"
        required
      />

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
        className="input mb-2"
        required
      />

      <button type="submit" className="btn btn-primary w-full">Envoyer</button>
    </form>
  );
}
