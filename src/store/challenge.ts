import State from '../@types/State'
import axios from 'axios'

import { createSlice, PayloadAction, SliceCaseReducers, Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';

export interface Attachment {
    id: number
    ext: string
    url: string
}

export interface Challenge {
    id: number,
    title: string,
    description: string,
    type: 'risposta_libera' | 'scelta_multipla' | 'upload' | 'risposta_aperta'
    multiple: boolean | null
    attachment: Attachment[]
    submissions: Array<{
        id: number,
        answer: string
        attachments: string[]
    }>
    answers: string
}

interface LeaderboardEntry {
    ptg: string,
    gruppo: string,
    sezione: string,
    score: number
}

export type LeaderboardEntries = LeaderboardEntry[]

type ChallengeState = {
    challenges: State<Challenge[]>
    leaderboard: State<LeaderboardEntries>
    submit: State<null>
    upload: number
};


const initialState: ChallengeState = {
    challenges: { status: 'NotAsked' },
    submit: { status: 'NotAsked' },
    upload: 0,
    leaderboard: { status: 'NotAsked' }
};

export const slice = createSlice<ChallengeState, SliceCaseReducers<ChallengeState>>({
    name: 'challenge',
    initialState,
    reducers: {
        _setChallenge: (state, action: PayloadAction<Challenge[]>) => ({ ...state, challenges: { status: 'Success', data: action.payload } }),
        _setLoading: (state) => ({ ...state, challenges: { status: 'Loading' } }),
        _setError: (state, action: PayloadAction<string>) => ({
            ...state,
            challenges: {
                status: 'Failure',
                error: action.payload
            }
        }),
        _resetSubmitting: (state) => ({ ...state, submit: { status: 'NotAsked' } }),
        _setSubmitting: (state) => ({ ...state, submit: { status: 'Loading' } }),
        _setSubmitError: (state, action: PayloadAction<string>) => ({
            ...state,
            submit: {
                status: 'Failure',
                error: action.payload
            }
        }),
        _setUploadProgress: (state, action: PayloadAction<number>) => 
        ({ ...state, upload: action.payload  } ),
        _setLeaderboard: (state, action: PayloadAction<LeaderboardEntries>) => 
        ({ ...state, leaderboard: {status: 'Success', data: action.payload  } }),
        _setLeaderboardLoading: (state) => 
        ({ ...state, leaderboard: {status: 'Loading' } }),
        _setLeaderboardError: (state, action: PayloadAction<string>) => 
        ({ ...state, leaderboard: {status: 'Failure', error: action.payload } })
    }
});

export interface LoginData {
    identifier: string,
    password: string
}

export const getChallenges = (): AppThunk => async dispatch => {
    const { _setChallenge, _setError, _setLoading } = slice.actions;
    dispatch(_setLoading(null));
    try {
        const { data } = await axios.get('http://admin.garaptg.online/sfides')
        dispatch(_setChallenge(data.sort((a: Challenge, b: Challenge) => a.id < b.id ? -1 : 1)))
    } catch (e) {
        dispatch(_setError(e.message))
    }
};

export const getLeaderboard = (): AppThunk => async dispatch => {
    const { _setLeaderboard, _setLeaderboardError, _setLeaderboardLoading } = slice.actions;
    dispatch(_setLeaderboardLoading(null));
    try {
        const { data } = await axios.get('http://admin.garaptg.online/submissions/leaderboard')
        dispatch(_setLeaderboard(data))
    } catch (e) {
        dispatch(_setLeaderboardError(e.message))
    }
};

export const refreshChallenge = (id: number) => async(dispatch: Dispatch, getState: () => RootState) => {
    const {_setChallenge} = slice.actions
    try {
        const currentChallenges = getState().challenge.challenges
        if(currentChallenges.status !== 'Success') return;
        const challenge = currentChallenges.data[id] 
        const { data } = await axios.get('http://admin.garaptg.online/sfides/' + challenge.id)
        const newChallenges = [...currentChallenges.data]
        newChallenges[id] = data 
        dispatch(_setChallenge(newChallenges))
    } catch(e) {
        console.log(e)
    }
}

export const submitChallenge = (id: number, value: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { _setSubmitError, _setSubmitting, _resetSubmitting, _setChallenge } = slice.actions;
    dispatch(_setSubmitting(null));
    try {
        const currentChallenges = getState().challenge.challenges
        if(currentChallenges.status !== 'Success') return;
        const { data } = await axios.post('http://admin.garaptg.online/submissions', { challenge: id, answer: value })
        const newChallenges = [...currentChallenges.data]
        const challengeIndex = newChallenges.findIndex(x => x.id === id)
        newChallenges[challengeIndex] = {...newChallenges[challengeIndex], submissions: [data]}
        dispatch(_setChallenge(newChallenges))
        dispatch(_resetSubmitting(null))
        return data
    } catch (e) {
        dispatch(_setSubmitError(e.message))
    }
}

export const uploadFile = (id: number, file: any): AppThunk => async (dispatch, getState) => {
    const { _setSubmitError, _setSubmitting, _resetSubmitting, _setUploadProgress} = slice.actions;
    dispatch(_setSubmitting(null));
    try {
        const currentChallenges = getState().challenge.challenges
        if(currentChallenges.status !== 'Success') return;
        const challenge = currentChallenges.data.find(x => x.id === id)
        if(!challenge)
            throw Error('Wat?')
        let refId
        if(challenge.submissions.length) {
            if(challenge?.submissions[0].attachments.length && !challenge.multiple)
                throw Error(`Esiste gia' un file per questa prova!`)
            refId = challenge.submissions[0].id
        }
        if(!challenge?.submissions.length) {
            const submission = await submitChallenge(id, '')(dispatch, getState)
            dispatch(_setSubmitting(null));
            refId = submission!.id
        }
        const formData = new FormData()
        formData.append('files', file)
        formData.append('refId', refId)
        formData.append('ref', 'submission')
        formData.append('field', 'attachments')

        await axios.post('http://admin.garaptg.online/upload', formData, {onUploadProgress: (progress) => {
            try {
                dispatch(_setUploadProgress((progress.loaded / progress.total * 100).toFixed(0)))
            } catch(e) {
                console.log(e)
            }
        }})
        dispatch(_resetSubmitting(null))
        await getChallenges()(dispatch, getState, null)
    } catch (e) {
        dispatch(_setSubmitError(e.message))
    }
}

export default slice.reducer;