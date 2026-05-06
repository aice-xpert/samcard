import { supabase } from './config/supabase.js';

async function runMigration() {
  try {
    // Add sectionOrder column
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE "CardContent" ADD COLUMN IF NOT EXISTS "sectionOrder" text[] DEFAULT '{}';`
    });

    if (error1) {
      console.error('Error adding sectionOrder:', error1);
    } else {
      console.log('Added sectionOrder column');
    }

    // Add unifiedOrder column
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE "CardContent" ADD COLUMN IF NOT EXISTS "unifiedOrder" text[] DEFAULT '{}';`
    });

    if (error2) {
      console.error('Error adding unifiedOrder:', error2);
    } else {
      console.log('Added unifiedOrder column');
    }

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();