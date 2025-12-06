
import React, { useState, useRef } from 'react';
import { Memory } from '../types';
import { Camera, Image as ImageIcon, Sparkles, Loader } from 'lucide-react';
import { generateMemoryImage } from '../services/geminiService';

interface RealLifeAlbumProps {
  memories: Memory[];
  onAddMemory: (note: string, imageUrl?: string) => void;
  canAdd: boolean;
}

const RealLifeAlbum: React.FC<RealLifeAlbumProps> = ({ memories, onAddMemory, canAdd }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      let finalImage = selectedImage;
      
      // If no image provided, try to generate one
      if (!finalImage) {
        setIsGenerating(true);
        try {
          // Attempt to generate an image based on the mood/text
          const generated = await generateMemoryImage(newNote);
          if (generated) {
            finalImage = generated;
          }
        } catch (err) {
          console.error("Failed to generate AI image", err);
        } finally {
          setIsGenerating(false);
        }
      }

      onAddMemory(newNote, finalImage || undefined);
      setNewNote('');
      setSelectedImage(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 font-sans flex items-center gap-2">
          <Camera className="w-6 h-6 text-teal-600"/> Àlbum de Vida Real (The Loot)
        </h3>
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
        <form onSubmit={handleSubmit} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fadeIn relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
              <Loader className="w-8 h-8 text-teal-600 animate-spin mb-2"/>
              <p className="text-teal-800 font-bold text-sm">Generant imatge màgica...</p>
            </div>
          )}
          
          <label className="block text-sm font-bold text-slate-700 mb-2">Què has viscut offline?</label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#00897B] focus:ring-1 focus:ring-[#00897B] outline-none min-h-[100px] text-lg mb-3"
            placeholder="Un passeig, un cafè, una lectura..."
          />
          
          <div className="mb-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {selectedImage ? (
              <div className="relative">
                <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button 
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5" /> Afegir foto (Opcional: Si no, la IA en farà una!)
              </button>
            )}
          </div>

          <div className="flex gap-3 mt-3">
            <button type="submit" className="flex-1 bg-[#00897B] text-white py-3 rounded-lg font-bold hover:bg-[#00796B] transition-colors">Guardar</button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-slate-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors">Cancel·lar</button>
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
              {mem.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden h-40">
                  <img src={mem.imageUrl} alt="Memory" className="w-full h-full object-cover" />
                </div>
              )}
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
