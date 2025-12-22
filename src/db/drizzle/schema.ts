import { pgTable, foreignKey, pgPolicy, uuid, numeric, text, timestamp, boolean, check, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const approval_status = pgEnum("approval_status", ['approved', 'rejected'])
export const proposal_status = pgEnum("proposal_status", ['pending', 'approved', 'rejected'])
export const proposal_type = pgEnum("proposal_type", ['spending', 'savings'])
export const subscription_frequency = pgEnum("subscription_frequency", ['weekly', 'monthly', 'yearly'])
export const transaction_status = pgEnum("transaction_status", ['planned', 'completed'])
export const transaction_type = pgEnum("transaction_type", ['income', 'expense'])


export const transactions = pgTable("transactions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  family_id: uuid().notNull(),
  user_id: uuid().notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  type: transaction_type().notNull(),
  category: text().notNull(),
  description: text(),
  date: timestamp({ mode: 'string' }).notNull(),
  is_recurring: boolean().default(false).notNull(),
  status: transaction_status().default('completed').notNull(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.family_id],
    foreignColumns: [families.id],
    name: "transactions_family_id_families_id_fk"
  }),
  foreignKey({
    columns: [table.user_id],
    foreignColumns: [profiles.id],
    name: "transactions_user_id_profiles_id_fk"
  }),
  pgPolicy("View family transactions", {
    as: "permissive", for: "select", to: ["public"], using: sql`(family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid())))` }),
  pgPolicy("Insert family transactions", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Update family transactions", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Delete family transactions", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const approvals = pgTable("approvals", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  proposal_id: uuid().notNull(),
  user_id: uuid().notNull(),
  status: approval_status().notNull(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.proposal_id],
    foreignColumns: [proposals.id],
    name: "approvals_proposal_id_proposals_id_fk"
  }),
  foreignKey({
    columns: [table.user_id],
    foreignColumns: [profiles.id],
    name: "approvals_user_id_profiles_id_fk"
  }),
  pgPolicy("View family approvals", {
    as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM proposals
  WHERE ((proposals.id = approvals.proposal_id) AND (proposals.family_id = ( SELECT profiles.family_id
           FROM profiles
          WHERE (profiles.id = auth.uid()))))))` }),
  pgPolicy("Manage own approvals", { as: "permissive", for: "all", to: ["public"] }),
]);

export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().notNull(),
  email: text().notNull(),
  full_name: text(),
  avatar_url: text(),
  family_id: uuid(),
  updated_at: timestamp({ mode: 'string' }).defaultNow(),
}, () => [
  pgPolicy("Update own profile", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = id)` }),
  pgPolicy("Insert own profile", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("View own profile", { as: "permissive", for: "select", to: ["public"], using: sql`(id = auth.uid())` }),
]);

export const families = pgTable("families", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  created_by: uuid(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.created_by],
    foreignColumns: [profiles.id],
    name: "families_created_by_profiles_id_fk"
  }),
  pgPolicy("Enable insert for authenticated users only", { as: "permissive", for: "insert", to: ["authenticated"], withCheck: sql`true` }),
  pgPolicy("View family", {
    as: "permissive", for: "select", to: ["public"], using: sql`((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = families.id)))))` }),
  pgPolicy("Update family", { as: "permissive", for: "update", to: ["public"], using: sql`(created_by = auth.uid())` }),
  pgPolicy("Delete family", { as: "permissive", for: "delete", to: ["public"], using: sql`(created_by = auth.uid())` }),
]);

export const bank_accounts = pgTable("bank_accounts", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  family_id: uuid().notNull(),
  name: text().notNull(),
  created_by: uuid().notNull(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.created_by],
    foreignColumns: [profiles.id],
    name: "bank_accounts_created_by_profiles_id_fk"
  }),
  foreignKey({
    columns: [table.family_id],
    foreignColumns: [families.id],
    name: "bank_accounts_family_id_families_id_fk"
  }).onDelete("cascade"),
  pgPolicy("Users can view their family's bank accounts", {
    as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = bank_accounts.family_id))))` }),
  pgPolicy("Users can insert bank accounts for their family", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can update their family's bank accounts", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can delete their family's bank accounts", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  family_id: uuid().notNull(),
  name: text().notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  frequency: subscription_frequency().notNull(),
  next_payment_date: timestamp({ mode: 'string' }).notNull(),
  bank_account_id: uuid(),
  category: text(),
  description: text(),
  is_active: boolean().default(true).notNull(),
  created_by: uuid().notNull(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.bank_account_id],
    foreignColumns: [bank_accounts.id],
    name: "subscriptions_bank_account_id_bank_accounts_id_fk"
  }).onDelete("set null"),
  foreignKey({
    columns: [table.created_by],
    foreignColumns: [profiles.id],
    name: "subscriptions_created_by_profiles_id_fk"
  }),
  foreignKey({
    columns: [table.family_id],
    foreignColumns: [families.id],
    name: "subscriptions_family_id_families_id_fk"
  }).onDelete("cascade"),
  pgPolicy("Users can view their family's subscriptions", {
    as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = subscriptions.family_id))))` }),
  pgPolicy("Users can insert subscriptions for their family", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Users can update their family's subscriptions", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Users can delete their family's subscriptions", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const categories = pgTable("categories", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  family_id: uuid().notNull(),
  name: text().notNull(),
  type: text().notNull(),
  icon: text(),
  color: text(),
  is_default: boolean().default(false),
  created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.family_id],
    foreignColumns: [families.id],
    name: "categories_family_id_fkey"
  }).onDelete("cascade"),
  pgPolicy("View family categories", {
    as: "permissive", for: "select", to: ["public"], using: sql`(family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid())))` }),
  pgPolicy("Insert family categories", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Update family categories", { as: "permissive", for: "update", to: ["public"] }),
  pgPolicy("Delete family categories", { as: "permissive", for: "delete", to: ["public"] }),
  check("categories_type_check", sql`type = ANY (ARRAY['income'::text, 'expense'::text, 'both'::text])`),
]);

export const proposals = pgTable("proposals", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  family_id: uuid().notNull(),
  proposer_id: uuid().notNull(),
  type: proposal_type().notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  description: text(),
  target_date: timestamp({ mode: 'string' }),
  status: proposal_status().default('pending').notNull(),
  created_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.family_id],
    foreignColumns: [families.id],
    name: "proposals_family_id_families_id_fk"
  }),
  foreignKey({
    columns: [table.proposer_id],
    foreignColumns: [profiles.id],
    name: "proposals_proposer_id_profiles_id_fk"
  }),
  pgPolicy("View family proposals", {
    as: "permissive", for: "select", to: ["public"], using: sql`(family_id = ( SELECT profiles.family_id
   FROM profiles
  WHERE (profiles.id = auth.uid())))` }),
  pgPolicy("Insert family proposals", { as: "permissive", for: "insert", to: ["public"] }),
  pgPolicy("Update family proposals", { as: "permissive", for: "update", to: ["public"] }),
]);
