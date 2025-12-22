-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."approval_status" AS ENUM('approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."proposal_type" AS ENUM('spending', 'savings');--> statement-breakpoint
CREATE TYPE "public"."subscription_frequency" AS ENUM('weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('planned', 'completed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"status" "transaction_status" DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "approval_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "approvals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"family_id" uuid,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "families" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"frequency" "subscription_frequency" NOT NULL,
	"next_payment_date" timestamp NOT NULL,
	"bank_account_id" uuid,
	"category" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"icon" text,
	"color" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "categories_type_check" CHECK (type = ANY (ARRAY['income'::text, 'expense'::text, 'both'::text]))
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"proposer_id" uuid NOT NULL,
	"type" "proposal_type" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"target_date" timestamp,
	"status" "proposal_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proposals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_proposer_id_profiles_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "View family transactions" ON "transactions" AS PERMISSIVE FOR SELECT TO public USING ((family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));--> statement-breakpoint
CREATE POLICY "Insert family transactions" ON "transactions" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Update family transactions" ON "transactions" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Delete family transactions" ON "transactions" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "View family approvals" ON "approvals" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM proposals
  WHERE ((proposals.id = approvals.proposal_id) AND (proposals.family_id = ( SELECT profiles.family_id
           FROM profiles
          WHERE (profiles.id = auth.uid())))))));--> statement-breakpoint
CREATE POLICY "Manage own approvals" ON "approvals" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Update own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = id));--> statement-breakpoint
CREATE POLICY "Insert own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "View own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Enable insert for authenticated users only" ON "families" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can view their family's bank accounts" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = bank_accounts.family_id)))));--> statement-breakpoint
CREATE POLICY "Users can insert bank accounts for their family" ON "bank_accounts" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their family's bank accounts" ON "bank_accounts" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their family's bank accounts" ON "bank_accounts" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their family's subscriptions" ON "subscriptions" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = subscriptions.family_id)))));--> statement-breakpoint
CREATE POLICY "Users can insert subscriptions for their family" ON "subscriptions" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their family's subscriptions" ON "subscriptions" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their family's subscriptions" ON "subscriptions" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "View family categories" ON "categories" AS PERMISSIVE FOR SELECT TO public USING ((family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));--> statement-breakpoint
CREATE POLICY "Insert family categories" ON "categories" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Update family categories" ON "categories" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Delete family categories" ON "categories" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "View family proposals" ON "proposals" AS PERMISSIVE FOR SELECT TO public USING ((family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));--> statement-breakpoint
CREATE POLICY "Insert family proposals" ON "proposals" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Update family proposals" ON "proposals" AS PERMISSIVE FOR UPDATE TO public;
*/