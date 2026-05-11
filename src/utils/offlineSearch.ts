
/**
 * MedVerify Offline Search Engine
 * This is the 'Internal Memory' that works when internet is gone.
 */

interface Medicine {
  n: string; // name
  c: string; // composition
  m: string; // manufacturer
}

let cachedDb: Medicine[] | null = null;

async function loadDb(): Promise<Medicine[]> {
  if (cachedDb) return cachedDb;
  
  try {
    const response = await fetch('/medicine_db.json');
    if (!response.ok) throw new Error('Offline database not found');
    cachedDb = await response.json();
    return cachedDb || [];
  } catch (error) {
    console.error('Failed to load offline database:', error);
    return [];
  }
}

export async function searchMedicineOffline(query: string) {
  const db = await loadDb();
  if (!db.length) return null;

  const searchTerm = query.toLowerCase().trim();
  
  // 1. Try Exact Match
  const exactMatch = db.find(m => m.n === searchTerm);
  if (exactMatch) return exactMatch;

  // 2. Try Partial Match (Starts with)
  const startsWith = db.find(m => m.n.startsWith(searchTerm));
  if (startsWith) return startsWith;

  // 3. Try Inclusion Match
  const includes = db.find(m => m.n.includes(searchTerm));
  if (includes) return includes;

  return null;
}
