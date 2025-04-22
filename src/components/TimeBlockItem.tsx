
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeBlock } from "@/types";

const categoryColors = {
  work: "bg-amber-100 border-amber-300 text-amber-800",
  rest: "bg-blue-100 border-blue-300 text-blue-800",
  exercise: "bg-green-100 border-green-300 text-green-800",
  leisure: "bg-purple-100 border-brand-purple-light text-brand-purple-dark",
  learning: "bg-indigo-100 border-indigo-300 text-indigo-800",
  meditation: "bg-cyan-100 border-cyan-300 text-cyan-800",
  social: "bg-pink-100 border-pink-300 text-pink-800",
  chores: "bg-gray-100 border-gray-300 text-gray-800",
  nutrition: "bg-emerald-100 border-emerald-300 text-emerald-800"
};

const energyBadges = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

interface TimeBlockItemProps {
  block: TimeBlock;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TimeBlockItem({ block, onToggleComplete, onEdit }: TimeBlockItemProps) {
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border-l-4 mb-2 cursor-pointer transition-all hover:shadow-md",
        categoryColors[block.category],
        block.completed ? "opacity-70" : "opacity-100"
      )}
      onClick={() => onEdit(block.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {block.startTime} - {block.endTime}
            </span>
            <span 
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border", 
                energyBadges[block.energy]
              )}
            >
              {block.energy}
            </span>
          </div>
          <h3 className={cn("font-semibold mt-1", block.completed && "line-through")}>{block.title}</h3>
          {block.description && (
            <p className="text-sm mt-0.5 text-gray-700">{block.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(block.id);
            }}
            className="text-brand-purple hover:text-brand-purple-dark"
          >
            {block.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
          <span className="text-xs font-semibold">{block.points} pts</span>
        </div>
      </div>
    </div>
  );
}
