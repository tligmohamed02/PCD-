
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BiLogInCircle } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux'
import { login, reset, getUserInfo } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner"


import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:8000/api/login/", {
            email,  // si tu utilises l'email et non username
            password,
          });

      const { access, refresh, role } = response.data;

      // Stocker les infos utilisateur dans le localStorage
      const { user_id } = response.data;

      localStorage.setItem("user", JSON.stringify({
        id: user_id,
        role,
      }));
      

      alert("Connexion réussie !");
      navigate("/dashboard");

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Nom d'utilisateur</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Mot de passe</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
