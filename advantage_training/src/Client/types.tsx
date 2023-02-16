
export interface Movement {
  name: string;
  weight: string;
  sets: string;
  reps: string;
}
export interface Day {
  name: string;
  movements: Movement[];
  dayNotes: string;
}

export interface Program {
  id: string;
  programName: string;
  programNotes?:string
  days: Day[];
}

export type Client = {
  id: string;
  firstName: string;
  lastName:string
  dob: string;
  height: string;
  weight: string;
  goals: string;
  clientNotes?: string;
  programs:Program[];
};
