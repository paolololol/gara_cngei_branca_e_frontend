import React, { useState, useEffect } from 'react'
import { Image, Box, Text, Heading, Paragraph, TextInput, Button, RadioButtonGroup } from 'grommet'
import State from '../../@types/State'
import {Challenge as IChallenge} from '../../store/challenge'
import { User } from '../../store/user'
import { RouteComponentProps } from 'react-router'

interface ChallengeProps {
    challenge: State<IChallenge>,
    login: State<User>,
    getChallenge: (id: number) => void
    submitChallenge: (data: any) => void
}

const Challenge: React.FC<ChallengeProps & RouteComponentProps> = ({history, login, challenge, getChallenge, submitChallenge}) => {
    const [challengeNumber, setCurrentChallengeNumber] = useState(1)
    const [value, setValue] = useState<string>('')
    useEffect(() => {
        if(login.status !== 'Success')
            history.replace('/login')
    }, [history, login])
    useEffect(() => {
        getChallenge(challengeNumber)
    }, [challengeNumber, getChallenge])
    if(!challenge || challenge.status !== 'Success') return null
    else {
    return (
        <Box wrap direction='row' pad='small' align='center' justify='center' height='100%'>
            <Box background='white' pad='small' round='medium'>
                <Heading level={2} margin='small'>{challenge.data.title}</Heading>
                <Text size='xsmall' margin='xsmall'>Sfida n.{challengeNumber}</Text>
                <Paragraph margin='xsmall'>{challenge.data.description}</Paragraph>
                {challenge.data.attachment.map((x) => <Image src={`http://cngeiptg.think3.tech:1337/${x.url}`} style={{objectFit: 'contain'}}/>)}
                {challenge.data.type === 'scelta_multipla' && (
                    <RadioButtonGroup
                        name='multiple'
                        options={challenge.data.answers.split('\n').filter(x => x.trim().length)}
                        value={value}
                        onChange={(event: any) => setValue(event.target.value)}
                    />
                )}
                {challenge.data.type === 'risposta_libera' &&
                    <TextInput placeholder='Inserisci la risposta' />}
                <Button margin={{ top: 'small' }} primary label={challenge.data.type === 'upload' ? 'Carica' : 'Procedi'}
                    onClick={() => setCurrentChallengeNumber(current => current + 1)} />
                </Box>
        </Box>
    )
    }
}

export default Challenge