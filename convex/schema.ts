import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Esta será a tabela que guardará as partidas e os votos
  partidas: defineTable({
    timeCasa: v.string(),     // Ex: "Flamengo"
    timeFora: v.string(),     // Ex: "Vasco"
    votosCasa: v.number(),    // Quantidade de votos
    votosFora: v.number(),    // Quantidade de votos
  }),
});