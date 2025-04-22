
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Brain } from "lucide-react";
import { TimeBlockItem } from "@/components/TimeBlockItem";
import { TimeBlockForm } from "@/components/TimeBlockForm";
import { DailySummary } from "@/components/DailySummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DaySchedule, TimeBlock } from "@/types";
import { 
  createTimeBlock, 
  generateTimeSlots, 
  productivityTips, 
  getTimeBasedTip 
} from "@/lib/productivity-utils";

// Inicializando com dados vazios
const initialSchedule: DaySchedule = {
  date: new Date().toISOString(),
  blocks: [],
  totalPoints: 0,
  completedBlocks: 0
};

const Index = () => {
  const [schedule, setSchedule] = React.useState<DaySchedule>(initialSchedule);
  const [openForm, setOpenForm] = React.useState(false);
  const [editingBlock, setEditingBlock] = React.useState<TimeBlock | undefined>(undefined);
  const [currentTip, setCurrentTip] = React.useState("");
  
  // Carrega dados salvos ao iniciar
  React.useEffect(() => {
    const savedSchedule = localStorage.getItem("daySchedule");
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        // Verifica se o cronograma salvo é do dia atual
        const savedDate = new Date(parsed.date);
        const today = new Date();
        if (
          savedDate.getDate() === today.getDate() &&
          savedDate.getMonth() === today.getMonth() &&
          savedDate.getFullYear() === today.getFullYear()
        ) {
          setSchedule(parsed);
        } else {
          // Se não for do dia atual, cria um novo
          const newSchedule = {
            ...initialSchedule,
            date: today.toISOString()
          };
          setSchedule(newSchedule);
          localStorage.setItem("daySchedule", JSON.stringify(newSchedule));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    
    // Define uma dica com base na hora atual
    const currentHour = new Date().getHours();
    setCurrentTip(getTimeBasedTip(currentHour));
    
    // Atualiza a dica a cada hora
    const tipInterval = setInterval(() => {
      const hour = new Date().getHours();
      setCurrentTip(getTimeBasedTip(hour));
    }, 3600000); // 1 hora
    
    return () => clearInterval(tipInterval);
  }, []);
  
  // Salva alterações no localStorage
  React.useEffect(() => {
    localStorage.setItem("daySchedule", JSON.stringify(schedule));
  }, [schedule]);
  
  // Adiciona um novo bloco de tempo
  const handleAddBlock = (data: Omit<TimeBlock, "id" | "completed" | "points">) => {
    const newBlock = createTimeBlock(
      data.startTime,
      data.endTime,
      data.title,
      data.description,
      data.category,
      data.energy
    );
    
    // Adiciona o bloco e atualiza as estatísticas
    setSchedule(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ),
      totalPoints: prev.totalPoints + newBlock.points,
    }));
  };
  
  // Atualiza um bloco existente
  const handleUpdateBlock = (data: Omit<TimeBlock, "id" | "completed" | "points">) => {
    if (!editingBlock) return;
    
    const updatedBlock = createTimeBlock(
      data.startTime,
      data.endTime,
      data.title,
      data.description,
      data.category,
      data.energy
    );
    
    setSchedule(prev => {
      const blockIndex = prev.blocks.findIndex(b => b.id === editingBlock.id);
      if (blockIndex === -1) return prev;
      
      const oldPoints = prev.blocks[blockIndex].points;
      const wasCompleted = prev.blocks[blockIndex].completed;
      
      // Mantém o status de conclusão e o ID original
      updatedBlock.id = editingBlock.id;
      updatedBlock.completed = wasCompleted;
      
      const newBlocks = [...prev.blocks];
      newBlocks[blockIndex] = updatedBlock;
      
      return {
        ...prev,
        blocks: newBlocks.sort((a, b) => a.startTime.localeCompare(b.startTime)),
        totalPoints: prev.totalPoints - oldPoints + updatedBlock.points,
      };
    });
    
    setEditingBlock(undefined);
  };
  
  // Alterna o status de conclusão de um bloco
  const handleToggleComplete = (id: string) => {
    setSchedule(prev => {
      const blockIndex = prev.blocks.findIndex(b => b.id === id);
      if (blockIndex === -1) return prev;
      
      const newBlocks = [...prev.blocks];
      const block = newBlocks[blockIndex];
      const newCompletedStatus = !block.completed;
      
      newBlocks[blockIndex] = {
        ...block,
        completed: newCompletedStatus
      };
      
      return {
        ...prev,
        blocks: newBlocks,
        completedBlocks: newCompletedStatus 
          ? prev.completedBlocks + 1 
          : prev.completedBlocks - 1,
      };
    });
  };
  
  // Edita um bloco existente
  const handleEditBlock = (id: string) => {
    const block = schedule.blocks.find(b => b.id === id);
    if (block) {
      setEditingBlock(block);
      setOpenForm(true);
    }
  };

  // Gera os horários para visualização da linha do tempo
  const timeSlots = generateTimeSlots();
  
  // Obtém data formatada em português
  const formattedDate = format(new Date(schedule.date), "EEEE, d 'de' MMMM", { locale: ptBR });
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-brand-purple-dark flex items-center gap-2">
          <Brain className="h-8 w-8 text-brand-purple" />
          Rhythm of Mind Flow
        </h1>
        <p className="text-brand-neutral-dark capitalize mt-1">{formattedDate}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="timeline" className="flex-1">Linha do Tempo</TabsTrigger>
              <TabsTrigger value="list" className="flex-1">Lista</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cronograma</h2>
                <Button onClick={() => {
                  setEditingBlock(undefined);
                  setOpenForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-brand-purple-light to-brand-blue-light text-brand-neutral-dark p-3 rounded-lg text-sm mb-4">
                <div className="flex items-start">
                  <Brain className="h-5 w-5 text-brand-purple mr-2 mt-0.5" />
                  <p>{currentTip}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {timeSlots.map((time, index) => {
                  if (index === timeSlots.length - 1) return null; // Skip the last time slot
                  
                  const startTime = time;
                  const endTime = timeSlots[index + 1];
                  const block = schedule.blocks.find(
                    b => b.startTime === startTime && b.endTime === endTime
                  );
                  
                  return (
                    <div key={time} className="flex items-start">
                      <div className="w-16 text-sm text-brand-neutral-dark pt-2">{time}</div>
                      <div className="flex-1">
                        {block ? (
                          <TimeBlockItem 
                            block={block} 
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleEditBlock}
                          />
                        ) : (
                          <div 
                            className="border border-dashed border-gray-300 rounded-lg h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              // Pré-configura o formulário com este horário
                              setEditingBlock(undefined);
                              setOpenForm(true);
                            }}
                          >
                            <span className="text-sm text-gray-500">+ Adicionar atividade</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Atividades</h2>
                <Button onClick={() => {
                  setEditingBlock(undefined);
                  setOpenForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              
              {schedule.blocks.length > 0 ? (
                <div className="space-y-2">
                  {schedule.blocks.map(block => (
                    <TimeBlockItem 
                      key={block.id} 
                      block={block} 
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditBlock}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-brand-neutral mb-3">Nenhuma atividade agendada para hoje.</p>
                    <Button onClick={() => setOpenForm(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Primeira Atividade
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <DailySummary schedule={schedule} />
          
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-4 w-4 text-brand-purple" />
                Dicas de Produtividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {productivityTips.slice(0, 5).map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-brand-purple-light text-xs flex items-center justify-center text-brand-purple-dark mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TimeBlockForm 
        open={openForm} 
        onOpenChange={setOpenForm}
        initialData={editingBlock}
        onSubmit={editingBlock ? handleUpdateBlock : handleAddBlock}
      />
    </div>
  );
};

export default Index;
