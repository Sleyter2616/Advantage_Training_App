
export interface Movement {
    name: string;
    weight: string;
    sets: string;
    reps: string;
  }
  
 export interface Day {
    name: string;
    movements: Movement[];
    notes?: string;
  }
  
 export interface Program {
    id: string;
    name: string;
    days: Day[];
    notesHistory: Array<{
      date: string;
      notes: string;
    }>;
  }
  