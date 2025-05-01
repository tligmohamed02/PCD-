import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";

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

  const handleTranscribeAndSummarize = async (meetingId) => {
    console.log("Données réunion:", meetings);

    const confirm = window.confirm("Voulez-vous transcrire et résumer cette réunion ?");
    if (!confirm) return;
  
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.access;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
  
      const response = await axios.post(`http://localhost:8000/meetings/process/${meetingId}/`, {}, config);
  
      alert("✅ Transcription et résumé enregistrés !");
      console.log(response.data);
  
    } catch (error) {
      console.error('Erreur lors de la transcription/summarization:', error);
      alert("❌ Une erreur est survenue lors de la transcription.");
    }
  };

  const handleDownloadPDF = async (meetingId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get(`http://localhost:8000/meetings/reunions/${meetingId}/summary/`, config);
      const { title, date, language, summary_text } = response.data;
  
      const doc = new jsPDF();
      let currentY = 20;
  
      // Couleurs personnalisées
      const primaryColor = "#2c3e50"; // Bleu foncé
      const secondaryColor = "#3498db"; // Bleu clair
      const accentColor = "#e74c3c"; // Rouge
  
      // En-tête
      doc.setFillColor(primaryColor);
      doc.rect(0, 0, 220, 40, "F");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("COMPTE-RENDU DE RÉUNION", 105, 25, { align: "center" });
  
      // Informations principales
      doc.setFontSize(12);
      doc.setTextColor(primaryColor);
      
      // Cadre d'informations
      doc.setDrawColor(secondaryColor);
      doc.setLineWidth(0.5);
      doc.rect(15, currentY + 10, 180, 35);
      
      doc.setFont("helvetica", "bold");
      doc.text("TITRE :", 20, currentY + 25);
      doc.setFont("helvetica", "normal");
      doc.text(title, 50, currentY + 25);
  
      doc.setFont("helvetica", "bold");
      doc.text("DATE :", 20, currentY + 35);
      doc.setFont("helvetica", "normal");
      doc.text(new Date(date).toLocaleString(), 50, currentY + 35);
  
      doc.setFont("helvetica", "bold");
      doc.text("LANGUE :", 20, currentY + 45);
      doc.setFont("helvetica", "normal");
      doc.text(language.toUpperCase(), 50, currentY + 45);
  
      currentY += 60;
  
      // Section Résumé
      doc.setFillColor(secondaryColor);
      doc.rect(15, currentY, 180, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("RÉSUMÉ", 20, currentY + 7);
  
      currentY += 15;
  
      // Contenu du résumé
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      const splitText = doc.splitTextToSize(summary_text || "Aucun résumé disponible.", 170);
      
      // Gestion multi-page
      splitText.forEach((line, index) => {
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(line, 20, currentY);
        currentY += 7;
      });
  
      // Ligne de signature
      currentY += 15;
      doc.setDrawColor(accentColor);
      doc.setLineWidth(0.3);
      doc.line(20, currentY, 80, currentY);
      doc.setTextColor(accentColor);
      doc.text("Signature", 20, currentY + 5);
  
      // Pied de page
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Document généré automatiquement - © " + new Date().getFullYear(), 105, 290, { align: "center" });
  
      doc.save(`pv_reunion_${title.replace(/\s/g, "_")}.pdf`);
    } catch (error) {
      console.error("Erreur lors du téléchargement du résumé :", error);
      alert("Erreur lors du téléchargement du résumé.");
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

                <button 
                  onClick={() => handleTranscribeAndSummarize(meeting._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Transcrire & Résumer
                </button>

                <button
                  onClick={() => handleDownloadPDF(meeting._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Télécharger Résumé (PDF)
                </button>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
