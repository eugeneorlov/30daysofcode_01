export const exercises = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscle: "Chest" },
  { id: "incline-bench", name: "Incline Bench Press", muscle: "Chest" },
  { id: "dumbbell-fly", name: "Dumbbell Fly", muscle: "Chest" },
  { id: "cable-crossover", name: "Cable Crossover", muscle: "Chest" },

  // Back
  { id: "deadlift", name: "Deadlift", muscle: "Back" },
  { id: "barbell-row", name: "Barbell Row", muscle: "Back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscle: "Back" },
  { id: "seated-row", name: "Seated Cable Row", muscle: "Back" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscle: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscle: "Shoulders" },
  { id: "face-pull", name: "Face Pull", muscle: "Shoulders" },

  // Legs
  { id: "squat", name: "Squat", muscle: "Legs" },
  { id: "leg-press", name: "Leg Press", muscle: "Legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscle: "Legs" },
  { id: "leg-curl", name: "Leg Curl", muscle: "Legs" },
  { id: "calf-raise", name: "Calf Raise", muscle: "Legs" },

  // Arms
  { id: "barbell-curl", name: "Barbell Curl", muscle: "Arms" },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscle: "Arms" },
  { id: "hammer-curl", name: "Hammer Curl", muscle: "Arms" },
  { id: "skull-crusher", name: "Skull Crusher", muscle: "Arms" },
];

// Unique muscle groups derived from exercise data
export const muscleGroups = [...new Set(exercises.map((e) => e.muscle))];
