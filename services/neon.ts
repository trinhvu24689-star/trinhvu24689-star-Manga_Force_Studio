import { neon } from '@neondatabase/serverless';
import { UserProfile, SubscriptionPlan } from '../types';
import { PLANS } from '../data';

// WARNING: In a real production app, NEVER expose your connection string in the frontend.
// This should be an environment variable.
// For this demo, we check if the env var exists, otherwise we fallback to localStorage.
const DATABASE_URL = process.env.DATABASE_URL;

// Initialize Neon client if URL is present
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Fallback to LocalStorage if DB is not connected
const STORAGE_KEY = 'mangaforge_user_data';

export const saveUserToDB = async (user: UserProfile) => {
  if (sql) {
    try {
      // Assuming a table 'users' exists with columns: id (text), plan_id (int), diamonds (int), rubies (int)
      // This is a simplified upsert for a single user demo
      // Fix: user.diamonds is a number, so we check against Infinity, not 'Unlimited'
      await sql`
        INSERT INTO users (id, plan_id, diamonds, rubies)
        VALUES ('demo-user', ${user.plan.id}, ${user.diamonds === Infinity ? -1 : user.diamonds}, ${user.rubies === Infinity ? -1 : user.rubies})
        ON CONFLICT (id) 
        DO UPDATE SET 
          plan_id = EXCLUDED.plan_id,
          diamonds = EXCLUDED.diamonds,
          rubies = EXCLUDED.rubies;
      `;
      console.log('Saved to Neon DB');
    } catch (error) {
      console.error('Neon DB Error:', error);
      // Fallback
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } else {
    // Local Storage Logic
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
};

export const loadUserFromDB = async (): Promise<UserProfile | null> => {
  if (sql) {
    try {
      const result = await sql`SELECT * FROM users WHERE id = 'demo-user'`;
      if (result && result.length > 0) {
        const row = result[0];
        const plan = PLANS.find(p => p.id === row.plan_id) || PLANS[0];
        
        return {
          plan,
          diamonds: row.diamonds === -1 ? Infinity : row.diamonds,
          rubies: row.rubies === -1 ? Infinity : row.rubies
        };
      }
    } catch (error) {
      console.error('Neon DB Load Error:', error);
    }
  }

  // Fallback to LocalStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};