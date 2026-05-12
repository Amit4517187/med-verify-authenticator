
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
let syncProgress = 0;
let syncError: string | null = null;

export const isOfflineDbReady = () => !!cachedDb;
export const isOfflineDbLoading = () => isLoading;
export const getOfflineSyncProgress = () => syncProgress;
export const getOfflineSyncError = () => syncError;

async function loadDb(force = false): Promise<Medicine[]> {
  if (cachedDb && !force) return cachedDb;
  if (isLoading && !force) return [];
  
  console.log("🚀 STARTING ROBUST OFFLINE SYNC...");
  isLoading = true;
  syncError = null;
  syncProgress = 0;

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch('/medicine_db.json', { 
        cache: 'no-cache',
        priority: 'low'
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      let loaded = 0;
      const chunks: Uint8Array[] = [];

      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (total) {
          syncProgress = Math.round((loaded / total) * 100);
        } else {
          syncProgress = Math.min(99, Math.round((loaded / (38 * 1024 * 1024)) * 100));
        }
      }

      const allChunks = new Uint8Array(loaded);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      const jsonString = new TextDecoder().decode(allChunks);
      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) throw new Error("Invalid format");

      cachedDb = data;
      syncProgress = 100;
      console.log(`✅ SYNC SUCCESS: ${cachedDb.length} records.`);
      return cachedDb;

    } catch (error: any) {
      attempt++;
      console.warn(`⚠️ Sync attempt ${attempt} failed:`, error.message);
      if (attempt >= maxAttempts) {
        syncError = error.message;
        isLoading = false;
        break;
      }
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }

  isLoading = false;
  return [];
}

export async function searchMedicineOffline(query: string, force = false) {
  if (!query.trim()) {
    await loadDb(force); // Just trigger load
    return null;
  }

  const db = await loadDb(force);
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
  const saltMatch = db.find(m => {
    const dbComp = m.c.toLowerCase();
    return dbComp.includes(cleanSearch) || dbComp.includes(originalSearch);
  });
  if (saltMatch) return saltMatch;

  // --- TIER 5: LOOSE NAME MATCH ---
  const looseMatch = db.find(m => {
    const dbName = m.n.toLowerCase();
    return dbName.includes(cleanSearch) || cleanSearch.includes(dbName);
  });
  if (looseMatch) return looseMatch;

  return null;
}
