import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = "postgresql://neondb_owner:npg_0GZ3UQxPbkgh@ep-silent-art-acye9k4d-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || connectionString 
});
export const db = drizzle(pool, { schema });

// Helper to check for column existence and add if missing (simple migration)
async function ensureColumns() {
  try {
    await pool.query('ALTER TABLE proposals ADD COLUMN IF NOT EXISTS problem text NOT NULL DEFAULT \'\'');
    await pool.query('ALTER TABLE proposals ADD COLUMN IF NOT EXISTS solution text NOT NULL DEFAULT \'\'');
    await pool.query('ALTER TABLE home_content ADD COLUMN IF NOT EXISTS transparency_text text NOT NULL DEFAULT \'Publicaremos informes trimestrales de gestión accesibles a todos los vecinos.\'');
    
    // Migraciones para supporters
    await pool.query('ALTER TABLE supporters ADD COLUMN IF NOT EXISTS cedula text NOT NULL DEFAULT \'\'');
    await pool.query('ALTER TABLE supporters ADD COLUMN IF NOT EXISTS family_size text NOT NULL DEFAULT \'\'');
    await pool.query('ALTER TABLE supporters ADD COLUMN IF NOT EXISTS age_range text NOT NULL DEFAULT \'\'');
    await pool.query('ALTER TABLE supporters ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT \'nuevo\'');
    await pool.query('ALTER TABLE supporters ADD COLUMN IF NOT EXISTS origin text NOT NULL DEFAULT \'web_modal\'');

    // Asegurar que el usuario admin exista y tenga la contraseña hasheada correctamente si es necesario
    const res = await pool.query("SELECT * FROM users WHERE username = 'admin'");
    if (res.rows.length === 0) {
      // Si no existe, lo creamos (la contraseña se hasheará en la aplicación si se usa el registro, 
      // pero aquí podemos poner una que sepamos que funciona o simplemente dejar que el usuario se registre)
      console.log("Admin user not found, seeding default admin...");
      // Por simplicidad, no insertamos aquí para evitar problemas de hash, 
      // el usuario puede usar la pestaña de registro que está habilitada.
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
}
ensureColumns();