import State from '../@types/State'
import axios from 'axios'

import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { AppThunk } from './store';

export interface Attachment {
    id: number
    ext: string
    url: string
}

export interface Challenge {
    title: string,
    description: string,
    type: 'risposta_libera' | 'scelta_multipla' | 'upload'
    multiple: boolean | null
    correct: string | null
    attachment: Attachment[]
    answers: string
}

type ChallengeState = State<Challenge>;

const initialState: ChallengeState = {
    status: 'NotAsked'
};

export const slice = createSlice<ChallengeState, SliceCaseReducers<ChallengeState>>({
    name: 'challenge',
    initialState,
    reducers: {
        _setChallenge: (_, action: PayloadAction<Challenge>) => ({ status: 'Success', data: action.payload }),
        _setLoading: () => ({ status: 'Loading' }),
        _setError: (_, action: PayloadAction<string>) => ({
            status: 'Failure',
            error: action.payload
        }),
    }
});

export interface LoginData {
    identifier: string,
    password: string
}

export const getChallenge = (id: number): AppThunk => async dispatch => {
    const { _setChallenge, _setError, _setLoading } = slice.actions;
    dispatch(_setLoading(null));
    try {
        const { data } = await axios.get('http://cngeiptg.think3.tech:1337/sfides')
        const challenge = data.find((x: any) => x.id === id)
        console.log(challenge)
        if(challenge) {
            dispatch(_setChallenge(challenge)) 
        } else {
            ;(window as any).location = '/victory'
        }
    } catch (e) {
        dispatch(_setError(e.message))
    }
};

export default slice.reducer;