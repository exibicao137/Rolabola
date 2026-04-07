"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect para a trava
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AdminPage() {
  const [autorizado, setAutorizado] = useState(false);
  const [timeCasa, setTimeCasa] = useState("");
  const [timeFora, setTimeFora] = useState("");
  
  const criarPartida = useMutation(api.myFunctions.criarPartida);
  const deletarPartida = useMutation(api.myFunctions.deletarPartida); // Função de deletar
  const partidas = useQuery(api.myFunctions.listarPartidas);

  // --- TRAVA DE SEGURANÇA ---
  useEffect(() => {
    const senhaDigitada = prompt("Senha de Administração Chute Mania:");
    if (senhaDigitada === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAutorizado(true);
    } else {
      alert("Acesso Negado!");
      window.location.href = "/"; // Expulsa o curioso para a Home
    }
  }, []);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeCasa || !timeFora) return;
    
    try {
      await criarPartida({ timeCasa, timeFora });
      setTimeCasa("");
      setTimeFora("");
      alert("Jogo lançado com sucesso! ⚽");
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
    }
  };

  // Se não estiver autorizado, não mostra nada
  if (!autorizado) return <div className="min-h-screen bg-gray-950 text-white p-10 font-sans">Verificando credenciais...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <h1 className="text-2xl font-black text-yellow-500 mb-8 uppercase italic">
        Painel de Controle - Chute Mania
      </h1>

      {/* FORMULÁRIO */}
      <section className="bg-gray-900 p-6 rounded-3xl border border-gray-800 mb-10 max-w-md shadow-2xl">
        <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Novo Jogo</h2>
        <form onSubmit={handleCriar} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nome do Time Casa" 
            value={timeCasa}
            onChange={(e) => setTimeCasa(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-yellow-500 outline-none"
          />
          <div className="text-center font-black text-gray-700 text-xs">VS</div>
          <input 
            type="text" 
            placeholder="Nome do Time Fora" 
            value={timeFora}
            onChange={(e) => setTimeFora(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm focus:border-yellow-500 outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all uppercase text-xs"
          >
            Publicar Partida
          </button>
        </form>
      </section>

      {/* LISTAGEM ATUAL COM BOTÃO DE DELETAR */}
      <section className="max-w-md">
        <h2 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Jogos Ativos</h2>
        <div className="space-y-3">
          {partidas?.map((partida: any) => (
            <div key={partida._id} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex justify-between items-center group">
              <span className="text-xs font-bold uppercase">{partida.timeCasa} vs {partida.timeFora}</span>
              <button 
                onClick={() => {
                  if(confirm("Deseja realmente encerrar este jogo?")) {
                    deletarPartida({ id: partida._id });
                  }
                }}
                className="text-[9px] bg-red-500/10 text-red-500 px-3 py-1 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold"
              >
                ENCERRAR
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}