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

  // 5. Generic Content Collections (Partners)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`content_collections\` (
      \`collection_key\` VARCHAR(50) NOT NULL,
      \`items\` JSON NOT NULL,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`collection_key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. Clients (business relationship records managed from the admin panel)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`clients\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`contact_person\` VARCHAR(150),
      \`email\` VARCHAR(150),
      \`phone\` VARCHAR(50),
      \`address\` VARCHAR(255),
      \`sector\` VARCHAR(100),
      \`status\` VARCHAR(50) NOT NULL DEFAULT 'Active',
      \`logo\` VARCHAR(255),
      \`client_since\` DATE NULL,
      \`notes\` TEXT,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Migration: ensure `avatar` column exists on `users` (added after initial release)
  const [avatarCol]: any = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'avatar'`
  );
  if (!avatarCol || avatarCol.length === 0) {
    await pool.query('ALTER TABLE `users` ADD COLUMN `avatar` VARCHAR(255) NULL AFTER `email`');
    console.log('[MySQL] Added `avatar` column to `users` table.');
  }

  // Migration: ensure `username` column exists on `users` (added to support
  // username/password login instead of email/password). Backfills existing
  // rows so the column can be made NOT NULL + UNIQUE.
  const [usernameCol]: any = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username'`
  );
  if (!usernameCol || usernameCol.length === 0) {
    await pool.query('ALTER TABLE `users` ADD COLUMN `username` VARCHAR(50) NULL AFTER `id`');

    // Known default accounts get clean, predictable usernames.
    await pool.query(
      "UPDATE `users` SET `username` = 'admin' WHERE `email` = 'admin@anikatrading.com' AND `username` IS NULL"
    );
    await pool.query(
      "UPDATE `users` SET `username` = 'manager' WHERE `email` = 'operations@anikatrading.com' AND `username` IS NULL"
    );

    // Any other existing accounts: derive a username from their email, deduped.
    const [remaining]: any = await pool.query('SELECT id, email FROM `users` WHERE `username` IS NULL');
    const taken = new Set<string>();
    for (const row of remaining || []) {
      const base = (row.email.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';
      let candidate = base;
      let suffix = 1;
      while (taken.has(candidate)) {
        candidate = `${base}${suffix++}`;
      }
      taken.add(candidate);
      await pool.query('UPDATE `users` SET `username` = ? WHERE `id` = ?', [candidate, row.id]);
    }

    await pool.query('ALTER TABLE `users` MODIFY COLUMN `username` VARCHAR(50) NOT NULL');
    await pool.query('ALTER TABLE `users` ADD UNIQUE INDEX `idx_users_username` (`username`)');
    console.log('[MySQL] Added `username` column to `users` table (backfilled + unique).');
  }

  console.log('[MySQL] All tables verified and ready.');
}
