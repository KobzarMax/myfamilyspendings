import { pgTable, uuid, text, timestamp, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const transactionStatusEnum = pgEnum('transaction_status', ['planned', 'completed']);
export const proposalTypeEnum = pgEnum('proposal_type', ['spending', 'savings']);
export const proposalStatusEnum = pgEnum('proposal_status', ['pending', 'approved', 'rejected']);
export const approvalStatusEnum = pgEnum('approval_status', ['approved', 'rejected']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense', 'both']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  familyId: uuid('family_id'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  createdBy: uuid('created_by').references(() => profiles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  name: text('name').notNull(),
  type: categoryTypeEnum('type').notNull(),
  icon: text('icon'),
  color: text('color'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  userId: uuid('user_id').references(() => profiles.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  status: transactionStatusEnum('status').default('completed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const proposals = pgTable('proposals', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  proposerId: uuid('proposer_id').references(() => profiles.id).notNull(),
  type: proposalTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  targetDate: timestamp('target_date'),
  status: proposalStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const approvals = pgTable('approvals', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  proposalId: uuid('proposal_id').references(() => proposals.id).notNull(),
  userId: uuid('user_id').references(() => profiles.id).notNull(),
  status: approvalStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
