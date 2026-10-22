import { neon } from "@neondatabase/serverless";

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "";

export const sql = neon(DATABASE_URL);

let tableInitialized = false;

export async function ensureTableExists() {
  if (tableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS votos (
        id SERIAL PRIMARY KEY,
        candidato VARCHAR(10) NOT NULL,
        fingerprint VARCHAR(128) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_votos_fingerprint ON votos(fingerprint);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_votos_created_at ON votos(created_at);`;
    tableInitialized = true;
  } catch (err) {
    console.error("Erro ao inicializar tabela votos:", err);
  }
}
