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
    upload: number,
    getChallenges: () => void
    logout: () => void
    refreshChallenge: (id: number) => void
    submitChallenge: (id: number, value: string) => void
    uploadFile: (id: number, value: string) => void
}

const LogoutBox = styled(Box)`
    position: fixed;
    top: 16px;
    right: 16px;
`

const Challenge: React.FC<ChallengeProps & RouteComponentProps> = ({
    history, submitStatus, uploadFile, upload, refreshChallenge,
    login, logout, challenges, getChallenges, submitChallenge }) => {
    const [challengeNumber, setCurrentChallengeNumber] = useState(-1)
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
        } else if (challengeNumber < 0 && challenges.status === 'Success') {
            setCurrentChallengeNumber(
                challenges.data.findIndex(x => !x.submissions.length)
            )
        }
    }, [challengeNumber, challenges, history])


    if (challengeNumber < 0 || !challenges || challenges.status !== 'Success') return null
    else {
        const challenge: IChallenge = (challenges as any).data[challengeNumber]
        const handleFile = (event: any) => uploadFile(challenge.id, event.target.files[0])
        return (
            <Box wrap direction='column' pad='small' align='center' justify='between' height='100vh' width='100vw' overflow='auto'>
                <Box gap='medium' width='100%'>
                    <Box direction='row' justify='evenly' wrap>
                        <Button label='Classifica' color='status-warning' onClick={() => history.push('/leaderboard')} />
                        <Button label='Esci' color='light-2' onClick={logout} />
                    </Box>
                    <Box direction='row' justify='between' wrap>
                        <Button label='Indietro' disabled={challengeNumber === 0 || submitStatus.status === 'Loading'} onClick={() => {
                            refreshChallenge(challengeNumber - 1)
                            setCurrentChallengeNumber(n => n - 1)
                        }} />
                        <Button label='Avanti' disabled={challengeNumber === (challenges.data.length - 1) || submitStatus.status === 'Loading'} onClick={() => {
                            refreshChallenge(challengeNumber + 1)
                            setCurrentChallengeNumber(n => n + 1)
                        }} />
                    </Box>
                </Box>
                <Box style={{ maxHeight: '80vh', display: 'block' }} overflow='auto' alignSelf='center' flex={{ grow: 1 }}>
                    <Box background='white' pad='small' round='medium' overflow='auto'>
                        <Heading level={2} margin='small'>{challenge.title}</Heading>
                        <Text size='small' margin='xsmall'>Sfida n.{challengeNumber + 1}</Text>
                        <Paragraph margin='xsmall'>{challenge.description}</Paragraph>
                        <Box margin={{ vertical: 'medium' }}>
                            {challenge.attachment.map((x) => ['.jpeg', '.jpg', '.png', '.gif', '.tiff', '.webp'].includes(x.ext)
                                ? <img src={`${x.url.startsWith('http') ? '' : 'http://admin.garaptg.online'}${x.url}`} style={{ objectFit: 'contain', maxHeight: '40vh' }} />
                                : <video src={`${x.url.startsWith('http') ? '' : 'http://admin.garaptg.online'}${x.url}`} style={{ objectFit: 'contain', maxHeight: '40vh' }} />)}
                        </Box>
                        {challenge.type === 'scelta_multipla' && (
                            <RadioButtonGroup
                                name='multiple'
                                disabled={!!challenge.submissions.length}
                                options={challenge.answers.split('\n').filter(x => x.trim().length).map(x => x.trim())}
                                value={challenge.submissions.length ? challenge.submissions[0].answer.trim() : value}
                                onChange={(event: any) => setValue(event.target.value)}
                            />
                        )}
                        {(challenge.type === 'risposta_libera' || challenge.type === 'risposta_aperta') &&
                            <TextArea onChange={(event: any) => setValue(event.target.value)}
                                disabled={!!challenge.submissions.length}
                                placeholder={
                                    challenge.submissions.length ? challenge.submissions[0].answer :
                                        'Inserisci la risposta'}
                            />}
                        {challenge.type !== 'upload' && (<Button
                            margin={{ top: 'small' }}
                            disabled={!value || !!challenge.submissions.length || submitStatus.status === 'Loading'}
                            primary
                            label={submitStatus.status === 'Loading' ? '...' : 'Salva'}
                            onClick={() => submitChallenge(challenge.id, value)} />)}
                        {challenge.type === 'upload' && (
                            <>
                                <input type='file' name='file' onChange={handleFile} ref={fileRef} style={{ display: 'none' }} />
                                {challenge.submissions.length ? <Text>{challenge.submissions[0].attachments.length} file caricati</Text> : null}
                                <Button
                                    margin={{ top: 'small' }}
                                    disabled={(challenge.submissions.length && challenge.submissions[0].attachments.length && !challenge.multiple) || submitStatus.status === 'Loading'}
                                    primary
                                    label={submitStatus.status === 'Loading' ? `Upload: ${upload}%` : 'Carica file'}
                                    onClick={() => (fileRef.current as any).click()} />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default Challenge