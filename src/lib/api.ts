import { supabase } from '../lib/supabase';

// Profile API
export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(userId: string, email: string, fullName: string) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, email, full_name: fullName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async ensureProfileExists(userId: string, email: string, fullName: string) {
    const { error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code === 'PGRST116') {
      return this.createProfile(userId, email, fullName);
    } else if (checkError) {
      throw checkError;
    }
  },

  async updateFamilyId(userId: string, familyId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ family_id: familyId })
      .eq('id', userId);

    if (error) throw error;
  },

  async getFamilyMembers(familyId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('family_id', familyId);

    if (error) throw error;
    return data;
  },
};

// Family API
export const familyApi = {
  async createFamily(name: string, createdBy: string) {
    const { data, error } = await supabase
      .from('families')
      .insert([{ name, created_by: createdBy }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFamily(familyId: string) {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Transaction API
export const transactionApi = {
  async getTransactions(familyId: string, limit?: number) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('family_id', familyId)
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createTransaction(transaction: {
    family_id: string;
    user_id: string;
    amount: string;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
    is_recurring: boolean;
    status: 'planned' | 'completed';
  }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBalance(familyId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('family_id', familyId);

    if (error) throw error;

    return data.reduce((acc, curr) => {
      return curr.type === 'income'
        ? acc + Number(curr.amount)
        : acc - Number(curr.amount);
    }, 0);
  },
};

// Proposal API
export const proposalApi = {
  async getProposals(familyId: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProposal(proposal: {
    family_id: string;
    proposer_id: string;
    type: 'spending' | 'savings';
    amount: string;
    description: string;
    target_date?: string;
  }) {
    const { data, error } = await supabase
      .from('proposals')
      .insert([proposal])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProposalStatus(proposalId: string, status: 'approved' | 'rejected') {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);

    if (error) throw error;
  },
};

// Approval API
export const approvalApi = {
  async getApprovals(proposalId?: string) {
    let query = supabase.from('approvals').select('*');

    if (proposalId) {
      query = query.eq('proposal_id', proposalId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createOrUpdateVote(proposalId: string, userId: string, status: 'approved' | 'rejected') {
    // Check if vote exists
    const { data: existingVote } = await supabase
      .from('approvals')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('approvals')
        .update({ status })
        .eq('id', existingVote.id);

      if (error) throw error;
    } else {
      // Create new vote
      const { error } = await supabase
        .from('approvals')
        .insert([{ proposal_id: proposalId, user_id: userId, status }]);

      if (error) throw error;
    }
  },
};

// Category API
export const categoryApi = {
  async getCategories(familyId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('family_id', familyId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createCategory(category: {
    family_id: string;
    name: string;
    type: 'income' | 'expense' | 'both';
    icon?: string;
    color?: string;
    is_default?: boolean;
  }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: {
    name?: string;
    type?: 'income' | 'expense' | 'both';
    icon?: string;
    color?: string;
  }) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async seedDefaultCategories(familyId: string) {
    const defaultCategories = [
      // Income categories
      { family_id: familyId, name: 'Salary', type: 'income' as const, icon: '💰', color: '#10b981', is_default: true },
      { family_id: familyId, name: 'Freelance', type: 'income' as const, icon: '💼', color: '#3b82f6', is_default: true },
      { family_id: familyId, name: 'Investment', type: 'income' as const, icon: '📈', color: '#8b5cf6', is_default: true },
      { family_id: familyId, name: 'Gift', type: 'income' as const, icon: '🎁', color: '#ec4899', is_default: true },
      { family_id: familyId, name: 'Other Income', type: 'income' as const, icon: '💵', color: '#6b7280', is_default: true },

      // Expense categories
      { family_id: familyId, name: 'Groceries', type: 'expense' as const, icon: '🛒', color: '#ef4444', is_default: true },
      { family_id: familyId, name: 'Rent', type: 'expense' as const, icon: '🏠', color: '#f59e0b', is_default: true },
      { family_id: familyId, name: 'Utilities', type: 'expense' as const, icon: '⚡', color: '#eab308', is_default: true },
      { family_id: familyId, name: 'Transportation', type: 'expense' as const, icon: '🚗', color: '#06b6d4', is_default: true },
      { family_id: familyId, name: 'Entertainment', type: 'expense' as const, icon: '🎬', color: '#a855f7', is_default: true },
      { family_id: familyId, name: 'Healthcare', type: 'expense' as const, icon: '🏥', color: '#dc2626', is_default: true },
      { family_id: familyId, name: 'Education', type: 'expense' as const, icon: '📚', color: '#2563eb', is_default: true },
      { family_id: familyId, name: 'Shopping', type: 'expense' as const, icon: '🛍️', color: '#db2777', is_default: true },
      { family_id: familyId, name: 'Dining', type: 'expense' as const, icon: '🍽️', color: '#f97316', is_default: true },
      { family_id: familyId, name: 'Other Expense', type: 'expense' as const, icon: '📝', color: '#6b7280', is_default: true },
    ];

    const { data, error } = await supabase
      .from('categories')
      .insert(defaultCategories)
      .select();

    if (error) throw error;
    return data;
  },
};

// Bank Account API
export const bankAccountApi = {
  async getBankAccounts(familyId: string) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('family_id', familyId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createBankAccount(account: {
    family_id: string;
    name: string;
    created_by: string;
  }) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert([account])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBankAccount(id: string, updates: { name?: string }) {
    const { data, error } = await supabase
      .from('bank_accounts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBankAccount(id: string) {
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Subscription API
export const subscriptionApi = {
  async getSubscriptions(familyId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, bank_accounts(id, name)')
      .eq('family_id', familyId)
      .order('next_payment_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createSubscription(subscription: {
    family_id: string;
    name: string;
    amount: string;
    frequency: 'weekly' | 'monthly' | 'yearly';
    next_payment_date: string;
    bank_account_id?: string | null;
    category?: string | null;
    description?: string | null;
    is_active?: boolean;
    created_by: string;
  }) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSubscription(id: string, updates: {
    name?: string;
    amount?: string;
    frequency?: 'weekly' | 'monthly' | 'yearly';
    next_payment_date?: string;
    bank_account_id?: string | null;
    category?: string | null;
    description?: string | null;
    is_active?: boolean;
  }) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSubscription(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getUpcomingSubscriptions(familyId: string, days: number = 30) {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, bank_accounts(id, name)')
      .eq('family_id', familyId)
      .eq('is_active', true)
      .gte('next_payment_date', now.toISOString())
      .lte('next_payment_date', future.toISOString())
      .order('next_payment_date', { ascending: true });

    if (error) throw error;
    return data;
  },
};

export const dashboardApi = {
  async getPendingProposals(familyId: string, userId: string) {
    // Fetch pending proposals
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('*')
      .eq('family_id', familyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (proposalsError) throw proposalsError;

    // Fetch user's votes for these proposals
    const proposalIds = proposals.map(p => p.id);
    if (proposalIds.length === 0) return [];

    const { data: votes, error: votesError } = await supabase
      .from('approvals')
      .select('proposal_id')
      .eq('user_id', userId)
      .in('proposal_id', proposalIds);

    if (votesError) throw votesError;

    const votedProposalIds = new Set(votes.map(v => v.proposal_id));

    // Return only proposals user hasn't voted on
    return proposals.filter(p => !votedProposalIds.has(p.id));
  },

  async getTransactionHistory(familyId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('family_id', familyId)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }
};

