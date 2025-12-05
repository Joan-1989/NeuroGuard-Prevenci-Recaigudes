
import React, { useState } from 'react';
import { Memory } from '../types';

interface RealLifeAlbumProps {
  memories: Memory[];
  onAddMemory: (note: string) => void;
  canAdd: boolean;
}

const RealLifeAlbum: React.FC<RealLifeAlbumProps> = ({ memories, onAddMemory, canAdd }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddMemory(newNote);
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 font-sans">Àlbum de Vida Real (The Loot)</h3>
        {canAdd && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#00897B] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#00796B] transition-colors"
          >
            + Nova Memòria
          </button>
        )}
      </div>

      {!canAdd && !isAdding && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-slate-500 text-sm">
            🔒 Carrega la bateria al 100% per desbloquejar l'accés d'escriptura.
          </p>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn">
          <label className="block text-sm font-bold text-slate-700 mb-2">Què has viscut offline?</label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none min-h-[100px] text-lg"
            placeholder="Un passeig, un cafè, una lectura..."
          />
          <div className="flex gap-3 mt-3">
            <button type="submit" className="flex-1 bg-[#00897B] text-white py-3 rounded-lg font-bold">Guardar</button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-slate-700 py-3 rounded-lg font-bold">Cancel·lar</button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {memories.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <span className="text-4xl mb-2">📷</span>
            <p>Encara no hi ha memòries.</p>
          </div>
        ) : (
          memories.map((mem) => (
            <div key={mem.id} className="bg-[#F8F9FA] p-4 rounded-xl border-l-4 border-[#00897B] relative group hover:shadow-md transition-shadow">
              <p className="text-slate-800 text-lg mb-2 leading-relaxed">{mem.note}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{mem.date}</span>
                <span className="text-xs bg-white px-2 py-1 rounded text-slate-500 border border-slate-200">{mem.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RealLifeAlbum;
