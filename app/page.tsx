"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const partidas = useQuery(api.myFunctions.listarPartidas);
  const votar = useMutation(api.myFunctions.votar);
  const [votosRealizados, setVotosRealizados] = useState<string[]>([]);

  useEffect(() => {
    const salvos = localStorage.getItem("chute-mania-votos");
    if (salvos) setVotosRealizados(JSON.parse(salvos));
  }, []);

  const handleVoto = async (id: any, time: "casa" | "fora") => {
    if (votosRealizados.includes(id)) return;
    try {
      await votar({ id, time });
      const novaLista = [...votosRealizados, id];
      setVotosRealizados(novaLista);
      localStorage.setItem("chute-mania-votos", JSON.stringify(novaLista));
    } catch (e) { console.error(e); }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans pb-20">
      {/* Header Profissional */}
      <nav className="w-full bg-gray-900 border-b border-gray-800 p-4 mb-10 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <span className="text-xl font-black italic text-yellow-500">CHUTE MANIA</span>
        <span className="text-xs font-mono text-gray-500">chutemania.com.br</span>
      </nav>

      <div className="flex flex-col items-center px-6">
        <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Próximos Jogos</h2>
        
        <div className="w-full max-w-md space-y-6">
          {partidas?.map((partida: any) => {
            const jaVotou = votosRealizados.includes(partida._id);
            
            // Função simples para gerar o nome do arquivo da imagem
            const getEscudo = (nomeTime: string) => 
              `/escudos/${nomeTime.toLowerCase().replace(/\s/g, '-')}.png`;

            return (
              <div key={partida._id} className="rounded-3xl bg-gray-900 p-8 shadow-2xl border border-gray-800 hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-center text-center">
                  
                  {/* TIME CASA */}
                  <div className="flex-1 flex flex-col items-center">
                    <img 
                      src={getEscudo(partida.timeCasa)} 
                      alt={partida.timeCasa}
                      className="w-16 h-16 object-contain mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/escudos/bola.png' }}
                    />
                    <p className="font-bold text-sm mb-2 text-gray-400 uppercase">{partida.timeCasa}</p>
                    <p className="text-5xl font-black text-green-400 mb-4 tabular-nums">{partida.votosCasa}</p>
                    <button 
                      disabled={jaVotou}
                      onClick={() => handleVoto(partida._id, "casa")}
                      className={`w-full py-3 rounded-2xl font-black ${jaVotou ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all'}`}
                    >
                      {jaVotou ? "VOTADO" : "CHUTAR"}
                    </button>
                  </div>

                  <div className="px-4 font-black text-xl text-gray-800 italic pt-10">VS</div>

                  {/* TIME FORA */}
                  <div className="flex-1 flex flex-col items-center">
                    <img 
                      src={getEscudo(partida.timeFora)} 
                      alt={partida.timeFora}
                      className="w-16 h-16 object-contain mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/escudos/bola.png' }}
                    />
                    <p className="font-bold text-sm mb-2 text-gray-400 uppercase">{partida.timeFora}</p>
                    <p className="text-5xl font-black text-green-400 mb-4 tabular-nums">{partida.votosFora}</p>
                    <button 
                      disabled={jaVotou}
                      onClick={() => handleVoto(partida._id, "fora")}
                      className={`w-full py-3 rounded-2xl font-black ${jaVotou ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all'}`}
                    >
                      {jaVotou ? "VOTADO" : "CHUTAR"}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}