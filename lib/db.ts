import { neon } from '@neondatabase/serverless';

// Allow build to succeed without DATABASE_URL by using a dummy connection
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

export const sql = neon(databaseUrl);
