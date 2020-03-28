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
    localStorage.removeItem('user')
        ; (window as any).location = '/'
    dispatch(_logout(null));
};

export const restore = (): AppThunk => async dispatch => {
    const { _setLoading, _setError, _login } = slice.actions;
    const raw = localStorage.getItem('user') 
    if(!raw) return
    const data = JSON.parse(raw)
    axios.defaults.headers["Authorization"] = `Bearer ${data.jwt}`
    dispatch(_login(data))
}

export const login = (loginData: LoginData): AppThunk => async dispatch => {
    const { _setLoading, _setError, _login } = slice.actions;
    dispatch(_setLoading(null));
    try {
        const { data } = await axios.post('http://admin.garaptg.online/auth/local', loginData)
        axios.defaults.headers["Authorization"] = `Bearer ${data.jwt}`
        localStorage.setItem('user', JSON.stringify(data))
        dispatch(_login(data))
    } catch (e) {
        dispatch(_setError(e.message))
    }
};

export default slice.reducer;
