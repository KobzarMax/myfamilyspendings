export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          family_id: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          family_id?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          family_id?: string | null
          updated_at?: string | null
        }
      }
      families: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          family_id: string
          name: string
          type: 'income' | 'expense' | 'both'
          icon: string | null
          color: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          type: 'income' | 'expense' | 'both'
          icon?: string | null
          color?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          type?: 'income' | 'expense' | 'both'
          icon?: string | null
          color?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          family_id: string
          user_id: string
          amount: string
          type: 'income' | 'expense'
          category: string
          description: string | null
          date: string
          is_recurring: boolean
          status: 'planned' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          amount: string
          type: 'income' | 'expense'
          category: string
          description?: string | null
          date: string
          is_recurring?: boolean
          status?: 'planned' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          amount?: string
          type?: 'income' | 'expense'
          category?: string
          description?: string | null
          date?: string
          is_recurring?: boolean
          status?: 'planned' | 'completed'
          created_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          family_id: string
          proposer_id: string
          type: 'spending' | 'savings'
          amount: string
          description: string | null
          target_date: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          proposer_id: string
          type: 'spending' | 'savings'
          amount: string
          description?: string | null
          target_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          proposer_id?: string
          type?: 'spending' | 'savings'
          amount?: string
          description?: string | null
          target_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          proposal_id: string
          user_id: string
          status: 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          user_id: string
          status: 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          user_id?: string
          status?: 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}
