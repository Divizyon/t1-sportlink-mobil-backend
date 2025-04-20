import { createClient } from '@supabase/supabase-js';
import logger from './logger';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Seed verilerini içeren objeler
const seedData = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@sportlink.com',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      name: 'Test User',
      email: 'test@sportlink.com',
      role: 'user',
      created_at: new Date().toISOString(),
    },
  ],
  sports: [
    {
      name: 'Futbol',
      description: 'Futbol spor dalı',
      created_at: new Date().toISOString(),
    },
    {
      name: 'Basketbol',
      description: 'Basketbol spor dalı',
      created_at: new Date().toISOString(),
    },
    {
      name: 'Voleybol',
      description: 'Voleybol spor dalı',
      created_at: new Date().toISOString(),
    },
  ],
  facilities: [
    {
      name: 'Sportlink Arena',
      address: 'İstanbul, Türkiye',
      capacity: 1000,
      created_at: new Date().toISOString(),
    },
  ],
};

// Seed işleminin yapılıp yapılmadığını kontrol eden flag,
let isSeeded = false;

export const seedDatabase = async (): Promise<void> => {
  try {
    // Eğer daha önce seed yapıldıysa, fonksiyondan çık
    if (isSeeded) {
      logger.info('Database already seeded');
      return;
    }

    // Her tablo için seed verilerini ekle
    for (const [table, data] of Object.entries(seedData)) {
      const { error } = await supabase.from(table).insert(data);
      
      if (error) {
        logger.error(`Error seeding ${table}: ${error.message}`);
        continue;
      }
      
      logger.info(`Successfully seeded ${table}`);
    }

    isSeeded = true;
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error during database seeding:', error);
    throw error;
  }
}; 