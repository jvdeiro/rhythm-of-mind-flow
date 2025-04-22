
import { ActivityCategory, TimeBlock } from "@/types";
// Implementação interna de UUID em vez de importar

// Valores de pontos base por categoria
const CATEGORY_POINTS: Record<ActivityCategory, number> = {
  work: 10,
  rest: 8,
  exercise: 12,
  leisure: 6,
  learning: 10,
  meditation: 8,
  social: 7,
  chores: 8,
  nutrition: 9
};

// Multiplicadores baseados no horário do dia
// Baseado em ciclos de energia natural do corpo
export function getTimeMultiplier(hour: number): number {
  // Manhã (8-11): Energia alta - bom para trabalho cognitivo complexo
  if (hour >= 8 && hour < 11) {
    return 1.2;
  }
  // Meio-dia (11-14): Queda após pico - melhor para tarefas leves
  else if (hour >= 11 && hour < 14) {
    return 0.9;
  }
  // Tarde (14-17): Segundo pico - bom para trabalho criativo
  else if (hour >= 14 && hour < 17) {
    return 1.1;
  }
  // Fim da tarde (17-20): Energia equilibrada
  else if (hour >= 17 && hour < 20) {
    return 1.0;
  }
  // Noite (20-24): Energia decrescente - melhor para atividades relaxantes
  else {
    return 0.8;
  }
}

// Calcula pontos com base no tipo de atividade, horário e energia requerida
export function calculatePoints(
  category: ActivityCategory,
  startTime: string,
  energy: "high" | "medium" | "low"
): number {
  const hour = parseInt(startTime.split(":")[0], 10);
  const basePoints = CATEGORY_POINTS[category];
  const timeMultiplier = getTimeMultiplier(hour);
  
  const energyMultiplier = energy === "high" ? 1.3 : energy === "medium" ? 1.0 : 0.8;
  
  // Cálculo final: pontos base * multiplicador de tempo * multiplicador de energia
  return Math.round(basePoints * timeMultiplier * energyMultiplier);
}

// Gera horários de 30 em 30 minutos das 8h às 24h
export function generateTimeSlots(): string[] {
  const slots = [];
  for (let hour = 8; hour <= 24; hour++) {
    const formattedHour = hour === 24 ? "00" : hour.toString().padStart(2, "0");
    slots.push(`${formattedHour}:00`);
    
    if (hour < 24) {
      slots.push(`${formattedHour}:30`);
    }
  }
  return slots;
}

// Criar um novo bloco de tempo
export function createTimeBlock(
  startTime: string,
  endTime: string,
  title: string,
  description: string | undefined,
  category: ActivityCategory,
  energy: "high" | "medium" | "low"
): TimeBlock {
  const points = calculatePoints(category, startTime, energy);
  
  return {
    id: uuidv4(),
    startTime,
    endTime,
    title,
    description,
    category,
    completed: false,
    energy,
    points
  };
}

// UUID simples para gerar IDs
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Sugestões baseadas em princípios neurocientíficos
export const productivityTips = [
  "Tarefas que exigem foco intenso são melhores realizadas de manhã (8h-11h).",
  "Agende pausas regulares - o cérebro precisa de descansos para manter o desempenho.",
  "Hidrate-se frequentemente - desidratação de apenas 2% reduz a cognição.",
  "Exercício físico aumenta o BDNF, uma proteína que estimula a neuroplasticidade.",
  "Sono de qualidade é essencial para consolidar a memória e limpar toxinas do cérebro.",
  "A técnica Pomodoro (25 min trabalho + 5 min descanso) respeita os ciclos naturais de atenção.",
  "Pratique atenção plena para reduzir a perda de energia mental com distração.",
  "Tarefas administrativas são melhores executadas à tarde (14h-16h).",
  "Exponha-se à luz natural de manhã para regular seu ciclo circadiano."
];

// Dicas específicas para diferentes momentos do dia
export function getTimeBasedTip(hour: number): string {
  if (hour >= 8 && hour < 11) {
    return "Período ótimo para trabalho cognitivo complexo e tomada de decisões.";
  } else if (hour >= 11 && hour < 14) {
    return "Bom momento para tarefas administrativas e refeições nutritivas.";
  } else if (hour >= 14 && hour < 17) {
    return "Período favorável para trabalho criativo e brainstorming.";
  } else if (hour >= 17 && hour < 20) {
    return "Ótimo para exercícios físicos e atividades sociais.";
  } else {
    return "Reduza exposição à luz azul e prepare-se para o descanso.";
  }
}
