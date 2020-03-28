import State from '../@types/State'
import axios from 'axios'

import { createSlice, PayloadAction, SliceCaseReducers, Dispatch } from '@reduxjs/toolkit';
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
        attachments: string[]
    }>
    answers: string
}

type ChallengeState = {
    challenges: State<Challenge[]>
    submit: State<null>
};

const initialState: ChallengeState = {
    challenges: { status: 'NotAsked' },
    submit: { status: 'NotAsked' }
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
    const { _setSubmitError, _setSubmitting, _resetSubmitting, _setChallenge } = slice.actions;
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

        await axios.post('http://admin.garaptg.online/upload', formData)
        dispatch(_resetSubmitting(null))
        await getChallenges()(dispatch, getState, null)
    } catch (e) {
        dispatch(_setSubmitError(e.message))
    }
}

export default slice.reducer;