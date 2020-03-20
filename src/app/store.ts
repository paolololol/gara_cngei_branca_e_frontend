import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    login: () => ({})
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
