import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
console.log("Database Path:", process.env.DATABASE_URL);