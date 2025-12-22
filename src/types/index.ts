import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  profiles,
  families,
  categories,
  transactions,
  proposals,
  approvals,
} from '../db/drizzle/schema';

// Infer types from Drizzle schema
export type User = InferSelectModel<typeof profiles>;
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export type Family = InferSelectModel<typeof families>;
export type NewFamily = InferInsertModel<typeof families>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export type Proposal = InferSelectModel<typeof proposals>;
export type NewProposal = InferInsertModel<typeof proposals>;

export type Approval = InferSelectModel<typeof approvals>;
export type NewApproval = InferInsertModel<typeof approvals>;

// Type aliases for convenience
export type TransactionType = Transaction['type'];
export type TransactionStatus = Transaction['status'];
export type ProposalType = Proposal['type'];
export type ProposalStatus = Proposal['status'];
export type ApprovalStatus = Approval['status'];
export type CategoryType = Category['type'];

