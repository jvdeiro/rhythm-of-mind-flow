
import * as React from "react";
import { ActivityCategory, TimeBlock } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeBlockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TimeBlock;
  onSubmit: (data: Omit<TimeBlock, "id" | "completed" | "points">) => void;
}

const categoryLabels: Record<ActivityCategory, string> = {
  work: "Trabalho",
  rest: "Descanso",
  exercise: "Exercício",
  leisure: "Lazer",
  learning: "Aprendizado",
  meditation: "Meditação",
  social: "Social",
  chores: "Tarefas",
  nutrition: "Alimentação"
};

const categories: ActivityCategory[] = [
  "work",
  "rest",
  "exercise",
  "leisure",
  "learning",
  "meditation",
  "social",
  "chores",
  "nutrition"
];

export function TimeBlockForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: TimeBlockFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [startTime, setStartTime] = React.useState(initialData?.startTime || "");
  const [endTime, setEndTime] = React.useState(initialData?.endTime || "");
  const [category, setCategory] = React.useState<ActivityCategory>(initialData?.category || "work");
  const [energy, setEnergy] = React.useState<"high" | "medium" | "low">(initialData?.energy || "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      startTime,
      endTime,
      category,
      energy,
    });
    onOpenChange(false);
  };

  const generateTimeOptions = () => {
    const times = [];
    let hour = 8;
    let minute = 0;
    
    while (hour < 24 || (hour === 0 && minute === 0)) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      times.push(`${formattedHour}:${formattedMinute}`);
      
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour += 1;
      }
      
      // Break if we've reached midnight
      if (hour === 0 && minute === 0) {
        times.push("00:00");
        break;
      }
    }
    
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Editar" : "Adicionar"} Bloco de Tempo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Início</Label>
                <Select 
                  value={startTime} 
                  onValueChange={setStartTime}
                  required
                >
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Horário inicial" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.slice(0, -1).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fim</Label>
                <Select 
                  value={endTime} 
                  onValueChange={setEndTime}
                  required
                >
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Horário final" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.slice(1).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as ActivityCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nível de Energia</Label>
              <RadioGroup 
                value={energy} 
                onValueChange={(value) => setEnergy(value as "high" | "medium" | "low")}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-sm">Baixo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-sm">Médio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-sm">Alto</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
