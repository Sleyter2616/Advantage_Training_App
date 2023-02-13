
export interface Movement {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
  notes?: string
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
  height: string;
  weight: string;
  goals: string;
  notes?: string;
  program?: string;
  trainingProgram?: TrainingProgram[];
  movements?: Movement[];
  notesHistory?: Note[];
};




  export interface Note {
    date: string;
    notes: string;
  }

 export interface TrainingProgramDayErrors {
    day?: string;
    movements?: { name?: string; weight?: number; sets?: number; reps?: number; }[];
  }