
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, createInitialUser } from '../services/firebase';
import { auth } from '../services/firebase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createInitialUser(userCredential.user);
      }
    } catch (err: any) {
      console.error(err);
      let msg = "Error d'autenticació";
      if (err.code === 'auth/wrong-password') msg = "Contrasenya incorrecta";
      if (err.code === 'auth/user-not-found') msg = "Usuari no trobat";
      if (err.code === 'auth/email-already-in-use') msg = "El correu ja existeix";
      if (err.code === 'auth/weak-password') msg = "La contrasenya és massa feble";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-orange-200">
            N
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">
            {isLogin ? 'Benvingut/da' : 'Crea el teu compte'}
          </h1>
          <p className="text-slate-500 mt-2">
            NeuroGuard | ACENCAS Prevenció Activa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correu Electrònic</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="nom@exemple.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasenya</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processant...' : (isLogin ? 'Iniciar Sessió' : "Registra't")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 hover:text-orange-800 text-sm font-semibold"
          >
            {isLogin ? "No tens compte? Registra't" : "Ja tens compte? Inicia sessió"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
