import React, { useState, useEffect, useRef } from 'react'
import { Image, Box, Text, Heading, Paragraph, TextInput, Button, RadioButtonGroup, TextArea } from 'grommet'
import State from '../../@types/State'
import { Challenge as IChallenge } from '../../store/challenge'
import { User } from '../../store/user'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

interface ChallengeProps {
    challenges: State<IChallenge[]>,
    login: State<User>,
    submitStatus: State<null>,
    getChallenges: () => void
    logout: () => void
    submitChallenge: (id: number, value: string) => void
    uploadFile: (id: number, value: string) => void
}

const LogoutBox = styled(Box)`
    position: fixed;
    top: 16px;
    right: 16px;
`

const Challenge: React.FC<ChallengeProps & RouteComponentProps> = ({
    history, submitStatus, uploadFile,
    login, logout, challenges, getChallenges, submitChallenge }) => {
    const [challengeNumber, setCurrentChallengeNumber] = useState(0)
    const [value, setValue] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const fileRef = useRef(null)
    useEffect(() => {
        if (login.status !== 'Success')
            history.replace('/login')
        else getChallenges()
    }, [getChallenges, history, login])

    useEffect(() => {
        if (challenges.status === 'Success' && !challenges.data.filter(x => !x.submissions.length).length) {
            history.replace('/victory')
        } else if (challenges.status === 'Success') {
            setCurrentChallengeNumber(
                challenges.data.findIndex(x => !x.submissions.length)
            )
        }
    }, [challenges, history])


    if (!challenges || challenges.status !== 'Success') return null
    else {
        const challenge: IChallenge = (challenges as any).data[challengeNumber]
        const handleFile = (event: any) => uploadFile(challenge.id, event.target.files[0])
        return (
            <Box wrap direction='row' pad='small' align='center' justify='center' height='100%' overflow='auto'>
                <Box background='white' pad='small' round='medium'>
                    <Box direction='row' justify='center' gap='medium'>
                        <Button label='Indietro' disabled={challengeNumber === 0} onClick={() => setCurrentChallengeNumber(n => n - 1)} />
                        <Button label='Avanti' disabled={challengeNumber === (challenges.data.length - 1)} onClick={() => setCurrentChallengeNumber(n => n + 1)} />
                    </Box>
                    <Heading level={2} margin='small'>{challenge.title}</Heading>
                    <Text size='small' margin='xsmall'>Sfida n.{challengeNumber + 1}</Text>
                    <Paragraph margin='xsmall'>{challenge.description}</Paragraph>
                    <Box margin={{ vertical: 'medium' }}>
                        {challenge.attachment.map((x) => ['.jpeg', '.jpg', '.png', '.gif', '.tiff', '.webp'].includes(x.ext)
                            ? <img src={`${x.url.startsWith('http') ? '' : 'http://admin.garaptg.online/'}${x.url}`} style={{ objectFit: 'contain', maxHeight: '40vh' }} />
                            : <video src={`${x.url.startsWith('http') ? '' : 'http://admin.garaptg.online/'}${x.url}`} style={{ objectFit: 'contain', maxHeight: '40vh' }} />)}
                    </Box>
                    {challenge.type === 'scelta_multipla' && (
                        <RadioButtonGroup
                            name='multiple'
                            disabled={!!challenge.submissions.length}
                            options={challenge.answers.split('\n').filter(x => x.trim().length)}
                            value={value}
                            onChange={(event: any) => setValue(event.target.value)}
                        />
                    )}
                    {(challenge.type === 'risposta_libera' || challenge.type === 'risposta_aperta') && !challenge.submissions.length &&
                        <TextArea onChange={(event: any) => setValue(event.target.value)} placeholder='Inserisci la risposta' />}
                    {challenge.type !== 'upload' && (<Button
                        margin={{ top: 'small' }}
                        disabled={!!challenge.submissions.length || submitStatus.status === 'Loading'}
                        primary
                        label={submitStatus.status === 'Loading' ? '...' : 'Salva'}
                        onClick={() => submitChallenge(challenge.id, value)} />)}
                    {challenge.type === 'upload' && (
                        <>
                        <input type='file' name='file' onChange={handleFile} ref={fileRef} style={{display: 'none'}}/>
                        <Button
                            margin={{ top: 'small' }}
                            disabled={(challenge.submissions.length && challenge.submissions[0].attachments.length && !challenge.multiple)|| submitStatus.status === 'Loading'}
                            primary
                            label={submitStatus.status === 'Loading' ? '...' : 'Carica file'}
                            onClick={() => (fileRef.current as any).click()}/>
                        </>
                    )}
                </Box>
                <LogoutBox>
                    <Button label='Esci' color='light-2' onClick={logout} />
                </LogoutBox>
            </Box>
        )
    }
}

export default Challenge