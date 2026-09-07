import { getPool } from './connection.js';

export async function runMigrations(): Promise<void> {
  const pool = getPool();
  console.log('[MySQL] Running schema migrations...');

  // 1. Pages Content Table (Stores full dynamic page CMS data as JSON)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`pages_content\` (
      \`page_key\` VARCHAR(50) NOT NULL,
      \`content\` JSON NOT NULL,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`page_key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Media Uploads Table (Stores binary image data directly as LONGBLOB)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`media_uploads\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`filename\` VARCHAR(255) NOT NULL UNIQUE,
      \`original_name\` VARCHAR(255) NOT NULL,
      \`mime_type\` VARCHAR(100) NOT NULL,
      \`file_size\` INT NOT NULL,
      \`image_data\` LONGBLOB NOT NULL,
      \`url\` VARCHAR(255) NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Leads & Inquiries Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`leads\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`company\` VARCHAR(150),
      \`email\` VARCHAR(150) NOT NULL,
      \`phone\` VARCHAR(50),
      \`sector\` VARCHAR(100),
      \`status\` VARCHAR(50) DEFAULT 'Pending',
      \`budget\` VARCHAR(100),
      \`message\` TEXT,
      \`notes\` TEXT,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Users Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`email\` VARCHAR(150) NOT NULL UNIQUE,
      \`password_hash\` VARCHAR(255) NOT NULL,
      \`role\` VARCHAR(50) NOT NULL DEFAULT 'admin',
      \`department\` VARCHAR(100),
      \`status\` VARCHAR(50) DEFAULT 'active',
      \`last_active\` VARCHAR(100),
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('[MySQL] All tables verified and ready.');
}
