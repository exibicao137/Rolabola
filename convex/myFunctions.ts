import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Função para listar todas as partidas (Placar Geral)
export const listarPartidas = query({
  handler: async (ctx) => {
    return await ctx.db.query("partidas").collect();
  },
});

// Função para criar uma nova partida (Ex: Corinthians vs Palmeiras)
export const criarPartida = mutation({
  args: { 
    timeCasa: v.string(), 
    timeFora: v.string() 
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("partidas", {
      timeCasa: args.timeCasa,
      timeFora: args.timeFora,
      votosCasa: 0,
      votosFora: 0,
    });
    return id;
  },
});

// Função para votar!
export const votar = mutation({
  args: { 
    id: v.id("partidas"), 
    time: v.union(v.literal("casa"), v.literal("fora")) 
  },
  handler: async (ctx, args) => {
    const partida = await ctx.db.get(args.id);
    if (!partida) throw new Error("Partida não encontrada");

    if (args.time === "casa") {
      await ctx.db.patch(args.id, { votosCasa: (partida.votosCasa ?? 0) + 1 });
    } else {
      await ctx.db.patch(args.id, { votosFora: (partida.votosFora ?? 0) + 1 });
    }
  },
});

// NOVA FUNÇÃO: Para deletar partidas pelo Painel do Dono
export const deletarPartida = mutation({
  args: { id: v.id("partidas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
