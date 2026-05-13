import { supabase } from "./config/supabase";

/**
 * Migration script to add existing users to Supabase Auth
 * Run this once to migrate all users from the User table to Supabase Auth
 * 
 * Usage: npx ts-node migrate_users_to_auth.ts
 */

async function migrateUsersToAuth() {
  console.log("[migration] Starting user migration to Supabase Auth...\n");

  try {
    // Get all users from the User table who don't have email verified
    // These are likely the old users that need migration
    const { data: users, error: fetchError } = await supabase
      .from("User")
      .select("id, email, name, passwordHash")
      .is("emailVerified", false); // Old users before emailVerified was set to true

    if (fetchError) {
      console.error("[migration] Error fetching users:", fetchError);
      return;
    }

    if (!users || users.length === 0) {
      console.log("[migration] No users to migrate.");
      return;
    }

    console.log(`[migration] Found ${users.length} users to migrate\n`);

    let successful = 0;
    let failed = 0;
    const failedEmails: string[] = [];

    // Migrate each user
    for (const user of users) {
      try {
        console.log(`[migration] Processing: ${user.email}`);

        // Check if user already exists in Auth
        const { data: existingAuth } = await supabase.auth.admin.getUserById(user.id);

        if (existingAuth?.user) {
          console.log(`  ✓ Already in Auth, skipping...`);
          successful++;
          continue;
        }

        // Generate a temporary random password since we have the hash but can't extract the original
        // Users will need to use "forgot password" to reset and use their original password
        const tempPassword = Math.random().toString(36).slice(-12);

        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          id: user.id, // Use the same ID to maintain relationships
          email: user.email,
          password: tempPassword,
          email_confirm: true, // Auto-confirm email
        });

        if (authError) {
          console.log(`  ✗ Failed: ${authError.message}`);
          failed++;
          failedEmails.push(user.email);
          continue;
        }

        // Update User table to set email as verified
        await supabase
          .from("User")
          .update({ emailVerified: true, emailVerifiedAt: new Date().toISOString() })
          .eq("id", user.id);

        console.log(`  ✓ Migrated successfully`);
        successful++;
      } catch (err) {
        console.error(`  ✗ Error: ${err}`);
        failed++;
        failedEmails.push(user.email);
      }
    }

    console.log(`\n[migration] Migration complete!`);
    console.log(`[migration] Successful: ${successful}`);
    console.log(`[migration] Failed: ${failed}`);

    if (failedEmails.length > 0) {
      console.log(`[migration] Failed emails: ${failedEmails.join(", ")}`);
      console.log(`\n[migration] Action needed: These users should reset their password using forgot-password`);
    } else {
      console.log(`\n[migration] All users migrated successfully!`);
      console.log(`[migration] Note: Users with temp passwords should use forgot-password to reset`);
    }
  } catch (err) {
    console.error("[migration] Unexpected error:", err);
  }
}

// Run migration
migrateUsersToAuth().then(() => {
  console.log("\n[migration] Done!");
  process.exit(0);
});
