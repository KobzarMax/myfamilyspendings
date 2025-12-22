import { relations } from "drizzle-orm/relations";
import { families, transactions, profiles, proposals, approvals, bank_accounts, subscriptions, categories } from "./schema";

export const transactionsRelations = relations(transactions, ({one}) => ({
	family: one(families, {
		fields: [transactions.family_id],
		references: [families.id]
	}),
	profile: one(profiles, {
		fields: [transactions.user_id],
		references: [profiles.id]
	}),
}));

export const familiesRelations = relations(families, ({one, many}) => ({
	transactions: many(transactions),
	profile: one(profiles, {
		fields: [families.created_by],
		references: [profiles.id]
	}),
	bank_accounts: many(bank_accounts),
	subscriptions: many(subscriptions),
	categories: many(categories),
	proposals: many(proposals),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	transactions: many(transactions),
	approvals: many(approvals),
	families: many(families),
	bank_accounts: many(bank_accounts),
	subscriptions: many(subscriptions),
	proposals: many(proposals),
}));

export const approvalsRelations = relations(approvals, ({one}) => ({
	proposal: one(proposals, {
		fields: [approvals.proposal_id],
		references: [proposals.id]
	}),
	profile: one(profiles, {
		fields: [approvals.user_id],
		references: [profiles.id]
	}),
}));

export const proposalsRelations = relations(proposals, ({one, many}) => ({
	approvals: many(approvals),
	family: one(families, {
		fields: [proposals.family_id],
		references: [families.id]
	}),
	profile: one(profiles, {
		fields: [proposals.proposer_id],
		references: [profiles.id]
	}),
}));

export const bank_accountsRelations = relations(bank_accounts, ({one, many}) => ({
	profile: one(profiles, {
		fields: [bank_accounts.created_by],
		references: [profiles.id]
	}),
	family: one(families, {
		fields: [bank_accounts.family_id],
		references: [families.id]
	}),
	subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	bank_account: one(bank_accounts, {
		fields: [subscriptions.bank_account_id],
		references: [bank_accounts.id]
	}),
	profile: one(profiles, {
		fields: [subscriptions.created_by],
		references: [profiles.id]
	}),
	family: one(families, {
		fields: [subscriptions.family_id],
		references: [families.id]
	}),
}));

export const categoriesRelations = relations(categories, ({one}) => ({
	family: one(families, {
		fields: [categories.family_id],
		references: [families.id]
	}),
}));