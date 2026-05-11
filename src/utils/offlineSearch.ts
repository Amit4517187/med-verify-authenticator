
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
  if (cachedDb) {
    console.log("Using cached offline database.");
    return cachedDb;
  }
  
  if (isLoading) {
    console.log("Database download already in progress...");
    return [];
  }
  
  console.log("🚀 STARTING OFFLINE SYNC (36MB)...");
  isLoading = true;
  try {
    const response = await fetch('/medicine_db.json', { 
      cache: 'no-cache', // Force fresh download if it's stuck
      priority: 'low'    // Don't block the UI
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid database format: Expected an array");
    }

    cachedDb = data;
    console.log(`✅ OFFLINE SYNC COMPLETE: ${cachedDb.length} records loaded.`);
    return cachedDb;
  } catch (error) {
    console.error('❌ OFFLINE SYNC FAILED:', error);
    isLoading = false; // Reset immediately on error
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
