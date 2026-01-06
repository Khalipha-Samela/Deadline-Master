const STORAGE_KEY = 'deadline_master';

export const storageService = {
  saveAssignments: (assignments) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  },
  
  loadAssignments: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse assignments from storage', e);
      return [];
    }
  }
};