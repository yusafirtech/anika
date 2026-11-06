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

  // 7. Quotations (formal PDF quotes admin builds from a lead/RFQ)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`quotations\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`quote_number\` VARCHAR(50) NOT NULL UNIQUE,
      \`lead_id\` VARCHAR(50) NULL,
      \`status\` VARCHAR(20) NOT NULL DEFAULT 'draft',
      \`buyer_name\` VARCHAR(150) NOT NULL,
      \`buyer_company\` VARCHAR(150),
      \`buyer_email\` VARCHAR(150) NOT NULL,
      \`buyer_country\` VARCHAR(100),
      \`line_items\` JSON NOT NULL,
      \`currency\` VARCHAR(10) NOT NULL DEFAULT 'USD',
      \`incoterm\` VARCHAR(30),
      \`destination_port\` VARCHAR(150),
      \`payment_terms\` VARCHAR(100),
      \`valid_until\` DATE NULL,
      \`notes\` TEXT,
      \`created_by\` VARCHAR(50) NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_quotations_lead\` (\`lead_id\`),
      INDEX \`idx_quotations_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 8. Newsletter Subscribers (market updates / export news opt-in)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`newsletter_subscribers\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`email\` VARCHAR(191) NOT NULL UNIQUE,
      \`name\` VARCHAR(150),
      \`source\` VARCHAR(50),
      \`status\` VARCHAR(20) NOT NULL DEFAULT 'active',
      \`subscribed_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`unsubscribed_at\` TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 9. Buyers (public-facing buyer accounts — separate from admin `users`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`buyers\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`company\` VARCHAR(150),
      \`email\` VARCHAR(191) NOT NULL UNIQUE,
      \`password_hash\` VARCHAR(255) NOT NULL,
      \`country\` VARCHAR(100),
      \`phone\` VARCHAR(50),
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Migration: link leads/quotations to the buyer account that submitted/owns
  // them (nullable — most leads still come from anonymous/guest inquiries).
  await addColumnIfMissing('leads', 'buyer_id', 'VARCHAR(50) NULL AFTER `id`');
  await addColumnIfMissing('quotations', 'buyer_id', 'VARCHAR(50) NULL AFTER `lead_id`');

  // Migration: email verification + password reset tokens on `buyers`.
  await addColumnIfMissing('buyers', 'email_verified', 'TINYINT(1) NOT NULL DEFAULT 0');
  await addColumnIfMissing('buyers', 'verification_token', 'VARCHAR(100) NULL');
  await addColumnIfMissing('buyers', 'verification_expires', 'DATETIME NULL');
  await addColumnIfMissing('buyers', 'reset_token', 'VARCHAR(100) NULL');
  await addColumnIfMissing('buyers', 'reset_expires', 'DATETIME NULL');

  // Migration: indexes for columns looked up by exact match on every
  // request (verify/reset-password tokens, and the buyer dashboard's
  // "my leads"/"my quotations" queries) — without these, each call does a
  // full table scan that only gets slower as the tables grow.
  await addIndexIfMissing('buyers', 'idx_buyers_verification_token', 'verification_token');
  await addIndexIfMissing('buyers', 'idx_buyers_reset_token', 'reset_token');
  await addIndexIfMissing('leads', 'idx_leads_buyer_id', 'buyer_id');
  await addIndexIfMissing('quotations', 'idx_quotations_buyer_id', 'buyer_id');

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

  // 7. Insights (industry news, product news, company updates)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`insights\` (
      \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
      \`slug\` VARCHAR(191) NOT NULL UNIQUE,
      \`title\` VARCHAR(255) NOT NULL,
      \`category\` VARCHAR(100) NOT NULL DEFAULT 'Industry News',
      \`excerpt\` TEXT,
      \`content\` MEDIUMTEXT,
      \`cover_image\` VARCHAR(255),
      \`related_product_slug\` VARCHAR(191) NULL,
      \`author\` VARCHAR(150),
      \`status\` VARCHAR(20) NOT NULL DEFAULT 'draft',
      \`featured\` TINYINT(1) NOT NULL DEFAULT 0,
      \`published_at\` DATETIME NULL,
      \`meta_title\` VARCHAR(255),
      \`meta_description\` VARCHAR(500),
      \`keywords\` VARCHAR(500),
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_insights_status_published\` (\`status\`, \`published_at\`),
      INDEX \`idx_insights_product\` (\`related_product_slug\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Migration: quote-form fields on `leads`. `country` and `subject` were
  // collected by the public form but previously dropped; `buyer_type`
  // distinguishes Bangladeshi bulk buyers from international inquiries.
  await addColumnIfMissing('leads', 'buyer_type', "VARCHAR(30) NOT NULL DEFAULT 'international' AFTER `sector`");
  await addColumnIfMissing('leads', 'country', 'VARCHAR(100) NULL AFTER `phone`');
  await addColumnIfMissing('leads', 'subject', 'VARCHAR(255) NULL AFTER `country`');

  // Migration: structured export RFQ fields on `leads`. Collected when a
  // buyer requests a quote/sample from a product page instead of sending a
  // free-text message only.
  await addColumnIfMissing('leads', 'request_type', "VARCHAR(20) NOT NULL DEFAULT 'general' AFTER `buyer_type`");
  await addColumnIfMissing('leads', 'product_slug', 'VARCHAR(191) NULL AFTER `request_type`');
  await addColumnIfMissing('leads', 'quantity', 'VARCHAR(50) NULL AFTER `product_slug`');
  await addColumnIfMissing('leads', 'quantity_unit', 'VARCHAR(30) NULL AFTER `quantity`');
  await addColumnIfMissing('leads', 'incoterm', 'VARCHAR(20) NULL AFTER `quantity_unit`');
  await addColumnIfMissing('leads', 'destination_port', 'VARCHAR(150) NULL AFTER `incoterm`');
  await addColumnIfMissing('leads', 'target_ship_date', 'VARCHAR(50) NULL AFTER `destination_port`');
  await addColumnIfMissing('leads', 'payment_terms', 'VARCHAR(50) NULL AFTER `target_ship_date`');

  console.log('[MySQL] All tables verified and ready.');
}

async function addColumnIfMissing(table: string, column: string, definition: string): Promise<void> {
  const pool = getPool();
  const [rows]: any = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (!rows || rows.length === 0) {
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`[MySQL] Added \`${column}\` column to \`${table}\` table.`);
  }
}

async function addIndexIfMissing(table: string, indexName: string, column: string): Promise<void> {
  const pool = getPool();
  const [rows]: any = await pool.query(
    `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName]
  );
  if (!rows || rows.length === 0) {
    await pool.query(`ALTER TABLE \`${table}\` ADD INDEX \`${indexName}\` (\`${column}\`)`);
    console.log(`[MySQL] Added index \`${indexName}\` on \`${table}\`.\`${column}\`.`);
  }
}
