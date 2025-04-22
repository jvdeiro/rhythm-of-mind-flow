
export type ActivityCategory = 
  | 'work' 
  | 'rest' 
  | 'exercise' 
  | 'leisure' 
  | 'learning' 
  | 'meditation' 
  | 'social' 
  | 'chores'
  | 'nutrition';

export interface TimeBlock {
  id: string;
  startTime: string; // format: "HH:MM" like "08:00"
  endTime: string; // format: "HH:MM" like "08:30"
  title: string;
  description?: string;
  category: ActivityCategory;
  completed: boolean;
  energy: 'high' | 'medium' | 'low'; // energy level required/expected
  points: number; // points earned when completed
}

export interface DaySchedule {
  date: string; // ISO string
  blocks: TimeBlock[];
  totalPoints: number;
  completedBlocks: number;
}
