
import { DaySchedule } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Brain, Calendar, Droplets, FlaskConical, Flame } from "lucide-react";

interface DailySummaryProps {
  schedule: DaySchedule;
}

export function DailySummary({ schedule }: DailySummaryProps) {
  const { blocks, totalPoints, completedBlocks } = schedule;
  const totalBlocks = blocks.length;
  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  
  // Calculando estatísticas por categoria
  const categoryCounts: Record<string, number> = {};
  const categoryCompletions: Record<string, number> = {};
  
  blocks.forEach(block => {
    if (!categoryCounts[block.category]) {
      categoryCounts[block.category] = 0;
      categoryCompletions[block.category] = 0;
    }
    categoryCounts[block.category]++;
    if (block.completed) {
      categoryCompletions[block.category]++;
    }
  });
  
  // Calculando a distribuição de energia
  const energyDistribution = {
    high: blocks.filter(b => b.energy === 'high').length,
    medium: blocks.filter(b => b.energy === 'medium').length,
    low: blocks.filter(b => b.energy === 'low').length
  };
  
  const totalEnergyBlocks = energyDistribution.high + energyDistribution.medium + energyDistribution.low;
  
  const formatPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-purple" />
            Resumo do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">{completedBlocks}/{totalBlocks} blocos</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 flex flex-col">
                <span className="text-sm text-muted-foreground">Pontos</span>
                <div className="flex items-center mt-1">
                  <BadgeCheck className="h-4 w-4 text-brand-purple mr-1" />
                  <span className="text-2xl font-bold">{totalPoints}</span>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3 flex flex-col">
                <span className="text-sm text-muted-foreground">Conclusão</span>
                <div className="flex items-center mt-1">
                  <Flame className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-2xl font-bold">{completionRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-brand-purple" /> 
                  Distribuição de Energia
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs">Baixa</span>
                  </div>
                  <span className="text-lg font-semibold mt-1">
                    {formatPercentage(energyDistribution.low, totalEnergyBlocks)}%
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs">Média</span>
                  </div>
                  <span className="text-lg font-semibold mt-1">
                    {formatPercentage(energyDistribution.medium, totalEnergyBlocks)}%
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs">Alta</span>
                  </div>
                  <span className="text-lg font-semibold mt-1">
                    {formatPercentage(energyDistribution.high, totalEnergyBlocks)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center py-3 px-4 bg-brand-purple bg-opacity-10 rounded-lg">
        <Droplets className="h-5 w-5 text-brand-blue mr-2" />
        <p className="text-sm text-brand-neutral-dark">
          Lembre-se de se hidratar! A hidratação ajuda no foco e energia mental.
        </p>
      </div>
      
      <div className="flex items-center justify-center py-3 px-4 bg-brand-blue-light rounded-lg">
        <FlaskConical className="h-5 w-5 text-brand-blue mr-2" />
        <p className="text-sm text-brand-neutral-dark">
          Dica: Blocos de 30 minutos ajudam a manter o cérebro focado e produtivo.
        </p>
      </div>
    </div>
  );
}
