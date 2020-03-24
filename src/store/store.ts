import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './user'
import challengeReducer from './challenge'

export const store = configureStore({
  reducer: {
    login: userReducer,
    challenge: challengeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
