import State from '../@types/State'
import axios from 'axios'

import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { AppThunk } from './store';

export interface User {
    jwt: string
    user: {
        id: number,
        username: string
    }
}

type UserState = State<User>;

const initialState: UserState = {
    status: 'NotAsked'
};

export const slice = createSlice<UserState, SliceCaseReducers<UserState>>({
    name: 'user',
    initialState,
    reducers: {
        _login: (_, action: PayloadAction<User>) => ({ status: 'Success', data: action.payload }),
        _setLoading: () => ({ status: 'Loading' }),
        _setError: (state, action: PayloadAction<string>) => ({
            status: 'Failure',
            error: action.payload
        }),
        _logout: () => initialState
    }
});

export interface LoginData {
    identifier: string,
    password: string
}

export const logout = (): AppThunk => dispatch => {
    const { _logout } = slice.actions;
    axios.defaults.headers['Authorization'] = undefined
        ; (window as any).location = '/'
    dispatch(_logout(null));
};

export const login = (loginData: LoginData): AppThunk => async dispatch => {
    const { _setLoading, _setError, _login } = slice.actions;
    dispatch(_setLoading(null));
    try {
        const { data } = await axios.post('http://cngeiptg.think3.tech:1337/auth/local', loginData)
        axios.defaults.headers["Authorization"] = `Bearer ${data.jwt}`
        localStorage.setItem('jwt', data.jwt)
        dispatch(_login(data))
    } catch (e) {
        dispatch(_setError(e.message))
    }
};

export default slice.reducer;
