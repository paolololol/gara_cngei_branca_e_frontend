import React, { useState } from 'react'
import { Box, Text, Heading, Paragraph, TextInput, Button } from 'grommet'

interface BaseChallenge {
    title: string,
    description: string,
    img?: string,
    video?: string,
    type: 'Open' | 'Choice' | 'Video' | 'Picture' | 'Audio'
}

interface ChoiceChallenge extends BaseChallenge {
    type: 'Choice'
    choices: string[]
    correct: string
}

interface OpenChallenge extends BaseChallenge {
    type: 'Open',
    correct: string
}

interface VideoChallenge extends BaseChallenge {
    type: 'Video'
}

type Challenge = ChoiceChallenge | OpenChallenge | VideoChallenge

const mockChallenges: Challenge[] = [
    {
        type: 'Open',
        title: 'Io so a memoria il morse',
        description: 'Decifrate il messaggio nascosto!',
        correct: 'Prova test 123',
        img: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/8e6ea913-8ccc-4924-82f0-e97117d13336/d9k9ie3-eb9df372-2e34-4480-a0e4-3ec58df7c6f4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzhlNmVhOTEzLThjY2MtNDkyNC04MmYwLWU5NzExN2QxMzMzNlwvZDlrOWllMy1lYjlkZjM3Mi0yZTM0LTQ0ODAtYTBlNC0zZWM1OGRmN2M2ZjQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Xhh0HCmqQWZA0cdJXucOk4bzYqbheIW6DQzUWzjaCJU'
    },
    {
        type: 'Video',
        title: 'Gara canora',
        description: 'Chiamatevi su Skype, Discord, Google Meet o simili e registrate un video di voi che cantate una canzone scout a vostra scelta',
        video: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/ZTLAx3VDX7g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    },
]

const Challenge: React.FC = () => {
    const [challengeNumber, setCurrentChallengeNumber] = useState(0)
    const currentChallenge = mockChallenges[challengeNumber]
    return (
        <Box wrap direction='row' pad='small' align='center' height='100%'>
            <Box background='white' pad='small' round='medium'>
                <Heading level={2} margin='small'>{currentChallenge.title}</Heading>
                <Text size='xsmall' margin='xsmall'>Sfida n.{challengeNumber + 1}</Text>
                <Paragraph margin='xsmall'>{currentChallenge.description}</Paragraph>
                {currentChallenge.img && <img src={currentChallenge.img} />}
                {currentChallenge.video && <div dangerouslySetInnerHTML={{ __html: currentChallenge.video }} />}
                {currentChallenge.type === 'Open' &&
                    <TextInput placeholder='Inserisci la risposta' />}
                <Button margin={{ top: 'small' }} primary label={currentChallenge.type === 'Video' ? 'Carica' : 'Procedi'}
                    onClick={() => setCurrentChallengeNumber(current => current + 1)} />
                </Box>
        </Box>
    )
}

export default Challenge