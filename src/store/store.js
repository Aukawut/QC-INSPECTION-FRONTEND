import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

export const useStoreQCInspection = create(
  devtools(
    persist(
      (set) => ({
        isLogin: false,
        isChange: false,
        token: '',
        login: () => set((state) => ({ ...state, isLogin: true })),
        info: [],
        setToken: (token) => set((state) => ({ ...state, token })),
        logout: () => set(() => ({ isLogin: false, info: [], token: '' })),
        setInfo: (info) => set((state) => ({ ...state, info })),
        render: () =>
          set((state) => ({ ...state, isChange: !useStoreQCInspection.getState().isChange })),
      }),
      {
        name: 'QC_INSPECTION_STORE',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
