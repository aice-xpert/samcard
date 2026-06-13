import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion | SamCard",
  description: "Instructions for requesting deletion of your SamCard data.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Data Deletion Request</h1>
        <p className="text-muted-foreground mb-8 text-sm">Last updated: June 2026</p>

        <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <p>
            If you signed into SamCard using Facebook and would like your data
            removed from our platform, you can do so using either of the methods
            below.
          </p>

          <div className="border border-border rounded-xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Option 1 — Delete from your account</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Log in to <Link href="/login" className="text-accent underline underline-offset-2">samcard.com/login</Link></li>
              <li>Go to <strong>Settings</strong> in the dashboard sidebar</li>
              <li>Scroll to <strong>Delete Account</strong> and confirm deletion</li>
            </ol>
            <p className="text-muted-foreground">
              This permanently removes your account, all cards, analytics, and
              any data associated with your Facebook login within 30 days.
            </p>
          </div>

          <div className="border border-border rounded-xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-foreground">Option 2 — Contact us</h2>
            <p>
              Email us at{" "}
              <a href="mailto:support@samcard.com" className="text-accent underline underline-offset-2">
                support@samcard.com
              </a>{" "}
              with the subject line <strong>"Data Deletion Request"</strong>. Include the
              email address or Facebook account you used to sign in. We will
              process your request within 30 days and confirm via email when
              complete.
            </p>
          </div>

          <p className="text-muted-foreground">
            For more information on how we handle your data, see our{" "}
            <Link href="/privacy-policy" className="text-accent underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
