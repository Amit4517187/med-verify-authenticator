
/**
 * MedVerify Offline Search Engine
 * This is the 'Internal Memory' that works when internet is gone.
 */

interface Medicine {
  n: string; // name
  c: string; // composition
  m: string; // manufacturer
  d?: string; // description
}

let cachedDb: Medicine[] | null = null;
let isLoading = false;

export const isOfflineDbReady = () => !!cachedDb;
export const isOfflineDbLoading = () => isLoading;

async function loadDb(): Promise<Medicine[]> {
  if (cachedDb) return cachedDb;
  if (isLoading) return [];
  
  isLoading = true;
  try {
    console.log("Loading massive offline database...");
    const response = await fetch('/medicine_db.json');
    if (!response.ok) throw new Error('Offline database not found');
    cachedDb = await response.json();
    console.log(`Offline database ready with ${cachedDb?.length} records.`);
    return cachedDb || [];
  } catch (error) {
    console.error('Failed to load offline database:', error);
    return [];
  } finally {
    isLoading = false;
  }
}

export async function searchMedicineOffline(query: string) {
  if (!query.trim()) {
    await loadDb(); // Just trigger load
    return null;
  }

  const db = await loadDb();
  if (!db.length) return null;

  // Sanitize query: lowercase, trim, remove double spaces
  const searchTerm = query.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // 1. Try Exact Match
  const exactMatch = db.find(m => m.n === searchTerm);
  if (exactMatch) return exactMatch;

  // 2. Try 'Contains' match for the name
  const containsMatch = db.find(m => m.n.includes(searchTerm));
  if (containsMatch) return containsMatch;

  // 3. Try searching in the Composition (if user typed salt name)
  const saltMatch = db.find(m => m.c.includes(searchTerm));
  if (saltMatch) return saltMatch;

  return null;
}
