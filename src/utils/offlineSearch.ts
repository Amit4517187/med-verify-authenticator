
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

  // 1. Sanitize & Normalize
  const originalSearch = query.toLowerCase().trim();
  const cleanSearch = originalSearch
    .replace(/(tablets|tablet|capsules|capsule|ip|bp|usp|injection|syrup|gel|ointment|mg|ml|mcg)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const searchNoSpaces = originalSearch.replace(/\s+/g, '');
  const cleanNoSpaces = cleanSearch.replace(/\s+/g, '');

  console.log(`Searching for: "${originalSearch}" (Cleaned: "${cleanSearch}")`);

  // --- TIER 1: EXACT MATCH ---
  const exactMatch = db.find(m => m.n.toLowerCase() === originalSearch);
  if (exactMatch) return exactMatch;

  // --- TIER 2: DEEP CONTAINS ---
  // Check if DB name is inside query OR query is inside DB name
  const deepMatch = db.find(m => {
    const dbName = m.n.toLowerCase();
    const dbNoSpaces = dbName.replace(/\s+/g, '');
    
    return dbName.includes(cleanSearch) || 
           cleanSearch.includes(dbName) ||
           dbNoSpaces.includes(cleanNoSpaces) ||
           cleanNoSpaces.includes(dbNoSpaces);
  });
  if (deepMatch) return deepMatch;

  // --- TIER 3: KEYWORD MATCH (Minimum 2 keywords) ---
  const keywords = cleanSearch.split(' ').filter(w => w.length > 2);
  if (keywords.length >= 2) {
    const keywordMatch = db.find(m => {
      const dbName = m.n.toLowerCase();
      // Check if ALL keywords are present in the DB name
      return keywords.every(k => dbName.includes(k));
    });
    if (keywordMatch) return keywordMatch;
  }

  // --- TIER 4: COMPOSITION MATCH ---
  const saltMatch = db.find(m => m.c.toLowerCase().includes(cleanSearch));
  if (saltMatch) return saltMatch;

  return null;
}
