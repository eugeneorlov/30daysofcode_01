export const muscleGroups = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core"];

export const trainingTypes = ["Bodybuilding", "Powerlifting", "CrossFit"];

export const exercises = [
  // Chest
  {
    id: "bench-press",
    name: "Bench Press",
    muscle: "Chest",
    tags: ["Bodybuilding", "Powerlifting"],
  },
  { id: "incline-bench", name: "Incline Bench Press", muscle: "Chest", tags: ["Bodybuilding"] },
  { id: "dumbbell-fly", name: "Dumbbell Fly", muscle: "Chest", tags: ["Bodybuilding"] },
  { id: "cable-crossover", name: "Cable Crossover", muscle: "Chest", tags: ["Bodybuilding"] },
  { id: "dips", name: "Dips", muscle: "Chest", tags: ["Bodybuilding", "CrossFit"] },
  { id: "push-ups", name: "Push-Ups", muscle: "Chest", tags: ["CrossFit"] },

  // Back
  { id: "deadlift", name: "Deadlift", muscle: "Back", tags: ["Powerlifting", "CrossFit"] },
  {
    id: "barbell-row",
    name: "Barbell Row",
    muscle: "Back",
    tags: ["Bodybuilding", "Powerlifting"],
  },
  { id: "pull-ups", name: "Pull-Ups", muscle: "Back", tags: ["Bodybuilding", "CrossFit"] },
  { id: "lat-pulldown", name: "Lat Pulldown", muscle: "Back", tags: ["Bodybuilding"] },
  { id: "seated-row", name: "Seated Cable Row", muscle: "Back", tags: ["Bodybuilding"] },
  { id: "t-bar-row", name: "T-Bar Row", muscle: "Back", tags: ["Bodybuilding"] },

  // Shoulders
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscle: "Shoulders",
    tags: ["Bodybuilding", "Powerlifting"],
  },
  { id: "lateral-raise", name: "Lateral Raise", muscle: "Shoulders", tags: ["Bodybuilding"] },
  { id: "face-pull", name: "Face Pull", muscle: "Shoulders", tags: ["Bodybuilding"] },
  { id: "arnold-press", name: "Arnold Press", muscle: "Shoulders", tags: ["Bodybuilding"] },
  { id: "front-raise", name: "Front Raise", muscle: "Shoulders", tags: ["Bodybuilding"] },
  { id: "push-press", name: "Push Press", muscle: "Shoulders", tags: ["CrossFit", "Powerlifting"] },

  // Legs
  { id: "squat", name: "Squat", muscle: "Legs", tags: ["Powerlifting", "CrossFit"] },
  { id: "leg-press", name: "Leg Press", muscle: "Legs", tags: ["Bodybuilding"] },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscle: "Legs",
    tags: ["Bodybuilding", "Powerlifting"],
  },
  { id: "leg-curl", name: "Leg Curl", muscle: "Legs", tags: ["Bodybuilding"] },
  { id: "leg-extension", name: "Leg Extension", muscle: "Legs", tags: ["Bodybuilding"] },
  { id: "lunges", name: "Lunges", muscle: "Legs", tags: ["Bodybuilding", "CrossFit"] },

  // Arms
  { id: "barbell-curl", name: "Barbell Curl", muscle: "Arms", tags: ["Bodybuilding"] },
  { id: "hammer-curl", name: "Hammer Curl", muscle: "Arms", tags: ["Bodybuilding"] },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscle: "Arms", tags: ["Bodybuilding"] },
  { id: "skull-crusher", name: "Skull Crusher", muscle: "Arms", tags: ["Bodybuilding"] },
  { id: "preacher-curl", name: "Preacher Curl", muscle: "Arms", tags: ["Bodybuilding"] },
  {
    id: "close-grip-bench",
    name: "Close-Grip Bench Press",
    muscle: "Arms",
    tags: ["Bodybuilding", "Powerlifting"],
  },

  // Core
  { id: "plank", name: "Plank", muscle: "Core", tags: ["CrossFit"] },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    muscle: "Core",
    tags: ["Bodybuilding", "CrossFit"],
  },
  { id: "cable-crunch", name: "Cable Crunch", muscle: "Core", tags: ["Bodybuilding"] },
  { id: "ab-wheel", name: "Ab Wheel Rollout", muscle: "Core", tags: ["CrossFit"] },
  { id: "russian-twist", name: "Russian Twist", muscle: "Core", tags: ["CrossFit"] },
  { id: "decline-sit-up", name: "Decline Sit-Up", muscle: "Core", tags: ["Bodybuilding"] },
];

export function getExercisesByMuscle(muscle) {
  return exercises.filter((ex) => ex.muscle === muscle);
}

export function getExercisesByTag(tag) {
  if (tag === "All") return exercises;
  return exercises.filter((ex) => ex.tags.includes(tag));
}
