import React, { useState, useEffect } from 'react'
import { Image, Box, Text, Heading, Paragraph, TextInput, Button, RadioButtonGroup } from 'grommet'
import State from '../../@types/State'
import {Challenge as IChallenge, getChallenges} from '../../store/challenge'
import { User } from '../../store/user'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

interface ChallengeProps {
    challenges: State<IChallenge[]>,
    login: State<User>,
    getChallenges: () => void
    logout: () => void
    submitChallenge: (data: any) => void
}

const LogoutBox = styled(Box)`
    position: fixed;
    top: 16px;
    right: 16px;
`

const Challenge: React.FC<ChallengeProps & RouteComponentProps> = ({history, login, logout, challenges, getChallenges, submitChallenge}) => {
    const [challengeNumber, setCurrentChallengeNumber] = useState(0)
    const [value, setValue] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    useEffect(() => {
        if(login.status !== 'Success')
            history.replace('/login')
        else getChallenges()
    }, [getChallenges, history, login])

    useEffect(() => {
        if(challenges.status === 'Success' && !challenges.data.filter(x => !x.submissions.length).length) {
            history.replace('/victory')
        } else if(challenges.status === 'Success') {
            setCurrentChallengeNumber(
                challenges.data.findIndex(x => !x.submissions.length)
            )
        }
    }, [challenges, history])

    const checkAnswer = () => {
        setCurrentChallengeNumber(current => current + 1)
    }
    
    if(!challenges || challenges.status !== 'Success') return null
    else {
    const challenge: IChallenge = (challenges as any).data[challengeNumber]
    return (
        <Box wrap direction='row' pad='small' align='center' justify='center' height='100%' overflow='auto'>
            <Box background='white' pad='small' round='medium'>
                <Box direction='row' justify='center' gap='medium'>
                    <Button label='Indietro' disabled={challengeNumber === 0} onClick={() => setCurrentChallengeNumber(n => n-1)}/>
                    <Button label='Avanti' disabled={challengeNumber === (challenges.data.length - 1)} onClick={() => setCurrentChallengeNumber(n => n+1)}/>
                </Box>
                <Heading level={2} margin='small'>{challenge.title}</Heading>
                <Text size='small' margin='xsmall'>Sfida n.{challengeNumber + 1}</Text>
                <Paragraph margin='xsmall'>{challenge.description}</Paragraph>
                <Box margin={{vertical: 'medium'}}>
                {challenge.attachment.map((x) => ['.jpeg', '.jpg', '.png', '.gif', '.tiff', '.webp'].includes(x.ext) ?
                    <img src={`${x.url.startsWith('http') ? '': 'http://cngeiptg.think3.tech:1337/'}${x.url}`} style={{objectFit: 'contain', maxHeight: '40vh'}}/>
                    : <video src={`${x.url.startsWith('http') ? '': 'http://cngeiptg.think3.tech:1337/'}${x.url}`} style={{objectFit: 'contain', maxHeight: '40vh'}}/>)}
                </Box>
                {challenge.type === 'scelta_multipla' && (
                    <RadioButtonGroup
                        name='multiple'
                        options={challenge.answers.split('\n').filter(x => x.trim().length)}
                        value={value}
                        onChange={(event: any) => setValue(event.target.value)}
                    />
                )}
                {challenge.type === 'risposta_libera' &&
                    <TextInput onChange={(event: any) => setValue(event.target.value)} placeholder='Inserisci la risposta' />}
                {error && <Text color='error'>La tua risposta non e' corretta!</Text>}
                <Button margin={{ top: 'small' }} primary label={challenge.type === 'upload' ? 'Carica' : 'Procedi'}
                    onClick={checkAnswer} />
                </Box>
                <LogoutBox>
                   <Button label='Esci' color='light-2' onClick={logout} /> 
                </LogoutBox>
        </Box>
    )
    }
}

export default Challenge