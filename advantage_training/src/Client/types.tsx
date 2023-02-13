
export interface Movement {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

export interface TrainingProgram {
  id: string;
  clientId: string;
  programName: string;
  program: {
    day: string;
    movements: Movement[];
  }[];
}

export type Client = {
    id: string;
    name: string;
    dob: string;
    height: number;
    weight: number;
    goals: string;
    notes?: string;
    program?: string;
    trainingProgram?: TrainingProgram[]
    movements?: Movement[];
    notesHistory?: string[];
  };
  



  export interface Note {
    date: string;
    notes: string;
  }

 export interface TrainingProgramDayErrors {
    day?: string;
    movements?: { name?: string; weight?: number; sets?: number; reps?: number; }[];
  }