import { Program, Day, Movement } from "./types";


export const handleProgramNameChange = (id: string, newName: string,
    programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === id ? { ...program, name: newName } : program
      )
    );
  };
  export const handleAddDay = (programId: string,
    programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === programId
          ? {
              ...program,
              days: [
                ...program.days,
                {
                  name: `Day ${program.days.length + 1}`,
                  movements: [],
                },
              ],
            }
          : program
      )
    );
  };
  export const handleDayNameChange = (programId: string, dayIndex: number, newName: string,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) => {
      const updatedPrograms = prevPrograms.map((program) => {
        if (program.id === programId) {
          const updatedDays = [...program.days];
          updatedDays[dayIndex] = { ...updatedDays[dayIndex], name: newName };
          return { ...program, days: updatedDays };
        }
        return program;
      });
      return updatedPrograms;
    });
  };
  export const handleDayNotesChange = (
    programId: string,
    dayIndex: number,
    newNotes: string,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>
  ) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => {
        if (program.id === programId) {
          const days = [...program.days];
          days[dayIndex] = { ...days[dayIndex], notes: newNotes };
          return { ...program, days };
        }
        return program;
      })
    );
  };
  export const handleMovementNameChange = (programId: string, dayIndex: number, movementIndex: number, newName: string,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) => {
        if (program.id === programId) {
          const updatedDays = program.days.map((day, i) => {
            if (i === dayIndex) {
              const updatedMovements = day.movements.map((movement, j) => {
                if (j === movementIndex) {
                  return {
                    ...movement,
                    name: newName,
                  };
                }
                return movement;
              });
              return {
                ...day,
                movements: updatedMovements,
              };
            }
            return day;
          });
          return {
            ...program,
            days: updatedDays,
          };
        }
        return program;
      })
    );
  };
  export const handleDeleteDay = (programId: string, dayIndex: number,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms(prevPrograms =>
      prevPrograms.map(program => {
        if (program.id === programId) {
          const updatedDays = [...program.days];
          updatedDays.splice(dayIndex, 1);
          return { ...program, days: updatedDays };
        }
        return program;
      })
    );
  };

 export const handleMovementWeightChange = (
    programId: string,
    dayIndex: number,
    movementIndex: number,
    newWeight: string,
    programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>
  ) => {
    setPrograms((prevPrograms) => {
      return prevPrograms.map((program) => {
        if (program.id === programId) {
          const days = program.days.map((day, i) => {
            if (i === dayIndex) {
              const movements = day.movements.map((movement, j) => {
                if (j === movementIndex) {
                  return {
                    ...movement,
                    weight: newWeight,
                  };
                }
                return movement;
              });
              return {
                ...day,
                movements,
              };
            }
            return day;
          });
          return {
            ...program,
            days,
          };
        }
        return program;
      });
    });
  };
  export const handleMovementSetsChange = (programId: string, dayIndex: number, movementIndex: number, newSets: string,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((programs) =>
      programs.map((program) => {
        if (program.id !== programId) return program;
        const newProgram = { ...program };
        const newDays = [...newProgram.days];
        const newMovements = [...newDays[dayIndex].movements];
        newMovements[movementIndex].sets = newSets;
        newDays[dayIndex] = { ...newDays[dayIndex], movements: newMovements };
        newProgram.days = newDays;
        return newProgram;
      })
    );
  };

 export const handleMovementRepsChange = (programId: string, dayIndex: number, movementIndex: number, newReps: string,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) => {
      return prevPrograms.map((program) => {
        if (program.id !== programId) {
          return program;
        }
        const updatedDays = [...program.days];
        const updatedMovements = [...program.days[dayIndex].movements];
        updatedMovements[movementIndex] = {
          ...program.days[dayIndex].movements[movementIndex],
          reps: newReps,
        };
        updatedDays[dayIndex] = {
          ...program.days[dayIndex],
          movements: updatedMovements,
        };
        return {
          ...program,
          days: updatedDays,
        };
      });
    });
  };
  export const handleDeleteMovement = (programId: string, dayIndex: number, movementIndex: number,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    setPrograms((prevPrograms) => {
      return prevPrograms.map((program) => {
        if (program.id === programId) {
          const days = [...program.days];
          const day = days[dayIndex];
          const movements = [...day.movements];
          movements.splice(movementIndex, 1);
          day.movements = movements;
          days[dayIndex] = day;
          program.days = days;
        }
        return program;
      });
    });
  };

 export const handleAddMovement = (programId: string, dayIndex: number,  programs: Program[],
    setPrograms: React.Dispatch<React.SetStateAction<Program[]>>) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id !== programId) {
        return program;
      }

      const updatedDays = program.days.map((day, index) => {
        if (index !== dayIndex) {
          return day;
        }

        const updatedMovements = [
          ...day.movements,
          {
            name: "",
            weight: "",
            sets: "",
            reps: "",
          },
        ];

        return {
          ...day,
          movements: updatedMovements,
        };
      });

      return {
        ...program,
        days: updatedDays,
      };
    });

    setPrograms(updatedPrograms);
  };

