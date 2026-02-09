const STORAGE_KEY = "bodybuilding-log-workouts";

export function loadWorkouts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

// Get today's date as YYYY-MM-DD string
export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Calculate total volume (weight × reps) for a list of sets
export function totalVolume(sets) {
  return sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
}
