export interface Movement {
  movementName: string;
  weight: string;
  sets: string;
  reps: string;
}
export interface Day {
  dayName: string;
  dayNotes: string;
  movements: Movement[];
}

export interface Program {
  id: string;
  programName: string;
  programNotes?: string;
  days: Day[];
}

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  height: string;
  weight: string;
  goals: string;
  clientNotes?: string;
  programs: Program[];
};
export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  dob: Date | undefined;
  height: number | undefined;
  weight: number | undefined;
  goals: string;
  memberNotes?: string;
  movementsScreen: MovementScreen[];
  history: History[];
};
export type MovementScreen = {
  id: string;
  movementName: string;
  movementLevel: 'Green' | 'Yellow' | 'Red';
};

export type History = {
  id: string;
  date: Date;
  dateNotes: string;
  programDay: string;
  completed: boolean;
};
