
interface TrainingProgramDay {
    day: string;
    movements: { name: string; weight: number; sets: number; reps: number; }[];
  }
export type Client = {
    id: string;
    name: string;
    dob: string;
    height: number;
    weight: number;
    goals: string;
    notes?: string;
    program: string;
    trainingProgram: TrainingProgramDay[]
    movements?: Movement[];
    notesHistory?: string[];
  };
  

 export interface Movement {
    name: string;
    weight: number;
    sets: number;
    reps: number;
  }

  export interface Note {
    date: string;
    notes: string;
  }

 export interface TrainingProgramDayErrors {
    day?: string;
    movements?: { name?: string; weight?: number; sets?: number; reps?: number; }[];
  }