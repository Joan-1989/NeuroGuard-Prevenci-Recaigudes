
import React, { useState, useEffect } from 'react';
import { UserProfile, RelapseManual } from '../types';
import { updateDoc, doc, db, archiveManual, collection, query, orderBy, getDocs, deleteDoc, messaging, getToken } from '../services/firebase';
import { User, Download, Archive, Trash2, Calendar, Bell } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    phone: user.phone || '',
    lastConsumptionDate: user.lastConsumptionDate || ''
  });
  const [manualHistory, setManualHistory] = useState<any[]>([]);
  const [daysSober, setDaysSober] = useState(0);

  useEffect(() => {
    loadHistory();
    calculateDays();
  }, [user]);

  const loadHistory = async () => {
    const q = query(collection(db, `users/${user.id}/manuals`), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const manuals = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setManualHistory(manuals);
  };

  const calculateDays = () => {
    if (!formData.lastConsumptionDate) return;
    const last = new Date(formData.lastConsumptionDate);
    const now = new Date();
    last.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
    setDaysSober(diff > 0 ? diff : 0);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        lastConsumptionDate: formData.lastConsumptionDate
      });
      calculateDays();
      alert("Perfil actualitzat!");
    } catch (e) {
      console.error(e);
      alert("Error guardant perfil.");
    }
  };

  const handleArchive = async () => {
    if (confirm("Vols guardar l'estat actual i començar un manual nou?")) {
      await archiveManual(user.id);
      loadHistory();
      alert("Manual arxivat i reiniciat.");
    }
  };

  const handleDeleteManual = async (manualId: string) => {
    if (confirm("Segur que vols esborrar aquest manual històric?")) {
      await deleteDoc(doc(db, `users/${user.id}/manuals`, manualId));
      loadHistory();
    }
  };

  const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Vapid key from original source code
            const token = await getToken(messaging, { vapidKey: 'BLq1MrJwgRyjPhVR7lgMUUJ4W4y1q4-4BXvwtwPSfd-sGU0RS8P_3ePNTLBK06nrxk1QnOxnW8m2hFjvMwiQz0U' });
            if (token) {
                console.log('FCM Token:', token);
                await updateDoc(doc(db, "users", user.id), { fcmToken: token });
                alert('Notificacions activades correctament.');
            } else {
                alert("No s'ha pogut obtenir el token.");
            }
        } else {
            alert('Permís denegat per a notificacions.');
        }
    } catch (error) {
        console.error("Error activating notifications:", error);
        alert("Error activant notificacions.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">El Meu Perfil</h2>
          <p className="text-slate-500">Gestiona les teves dades i el teu progrés.</p>
        </div>
        <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-xl text-center">
            <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Dies Guanyats</p>
            <p className="text-3xl font-bold text-green-700">{daysSober}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Data Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500"/> Dades Personals
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Cognoms</label>
                <input type="text" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Telèfon</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Últim Consum</label>
              <input type="date" value={formData.lastConsumptionDate || ''} onChange={e => setFormData({...formData, lastConsumptionDate: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <button onClick={handleSave} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors">Guardar Canvis</button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
             <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
               <Bell className="w-5 h-5 text-orange-500"/> Notificacions
             </h3>
             <button onClick={requestNotificationPermission} className="w-full border border-slate-300 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-50">Activar Notificacions Push</button>
          </div>
        </div>

        {/* Manual Actions & History */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5 text-blue-500"/> Gestió del Manual
            </h3>
            <p className="text-sm text-slate-500 mb-4">Si vols començar de zero però guardar la feina feta, arxiva el manual actual.</p>
            <button onClick={handleArchive} className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-lg font-bold hover:bg-blue-100 flex items-center justify-center gap-2">
              <Archive className="w-4 h-4" /> Arxivar Manual Actual i Reiniciar
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500"/> Historial
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {manualHistory.length === 0 && <p className="text-slate-400 text-sm">No hi ha manuals arxivats.</p>}
              {manualHistory.map((m) => (
                <div key={m.id} className={`p-3 rounded-lg border flex justify-between items-center ${m.id === user.activeManualId ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div>
                    <p className="font-bold text-sm text-slate-700">
                      {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString() : 'Data desconeguda'}
                    </p>
                    {m.id === user.activeManualId && <span className="text-xs text-green-600 font-bold">ACTIU</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4"/></button>
                    {m.id !== user.activeManualId && (
                      <button onClick={() => handleDeleteManual(m.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
