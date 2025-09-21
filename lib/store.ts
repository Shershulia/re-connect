'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, User } from './api';

interface UserStatus {
  nickname: string;
  status: 'submitted' | 'registered';
  timestamp: number;
}

interface OctopusState {
  users: User[];
  nicknames: string[];
  isLoading: boolean;
  error: string | null;
  userStatuses: UserStatus[];
  addNickname: (nickname: string) => Promise<{ success: boolean; error?: string }>;
  loadUsers: () => Promise<void>;
  clearError: () => void;
  getUserStatus: (nickname: string) => UserStatus | null;
}

export const useOctopusStore = create<OctopusState>()(
  persist(
    (set, get) => ({
      users: [],
      nicknames: [],
      isLoading: false,
      error: null,
      userStatuses: [],
      
      addNickname: async (nickname: string) => {
        // Валидация входных данных
        if (!nickname || typeof nickname !== 'string') {
          return { success: false, error: 'Invalid nickname' };
        }
        
        const sanitizedNickname = nickname.trim().slice(0, 50);
        if (sanitizedNickname.length === 0) {
          return { success: false, error: 'Nickname cannot be empty' };
        }
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.addUser(sanitizedNickname);
          
          // Обновляем состояние с новыми данными
          set((state) => ({ 
            users: response.users,
            nicknames: response.users.map(user => user.nickname),
            userStatuses: [
              ...state.userStatuses.filter(s => s.nickname !== sanitizedNickname),
              { nickname: sanitizedNickname, status: 'registered', timestamp: Date.now() }
            ],
            isLoading: false 
          }));
          
          return { success: true };
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to add user';
          
          // Сохраняем статус "submitted" даже при ошибке
          set((state) => ({
            userStatuses: [
              ...state.userStatuses.filter(s => s.nickname !== sanitizedNickname),
              { nickname: sanitizedNickname, status: 'submitted', timestamp: Date.now() }
            ],
            error: errorMessage,
            isLoading: false 
          }));
          
          return { success: false, error: errorMessage };
        }
      },
      
      loadUsers: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const users = await apiClient.getUsers();
          set({ 
            users,
            nicknames: users.map(user => user.nickname),
            isLoading: false 
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to load users';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      getUserStatus: (nickname: string) => {
        const state = get();
        return state.userStatuses.find(s => s.nickname.toLowerCase() === nickname.toLowerCase()) || null;
      },
    }),
    {
      name: 'octopus-store',
      // Сохраняем nicknames и статусы пользователей для локального кеша
      partialize: (state) => ({ 
        nicknames: state.nicknames,
        userStatuses: state.userStatuses 
      }),
    }
  )
);