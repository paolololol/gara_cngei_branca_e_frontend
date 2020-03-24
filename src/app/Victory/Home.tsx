import React, { useState } from 'react'
import { Heading, Paragraph, Box } from 'grommet'
import { Link, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import cngei from '../../assets/cngei.png'
import branca from '../../assets/branca.png'
import State from '../../@types/State'
import { User } from '../../store/user'

const Logo = styled.img`
    max-height: 20vh;
`

const StyledLink = styled(Link)`
    color: white;
    font-size: 2.5em;
    font-weight: 500;
`

interface HomeProps {
    login: State<User>
}

const Home: React.FC<HomeProps & RouteComponentProps> = ({login, history}) => {
    const now = Date.now()
    const target = Date.parse('March 30, 2020 16:55:00 GMT+01:00')
    const [challengeHasBegun, setChallengeHasBegun] = useState(now > target)
    return (
        <Box
            height='100vh'
            justify='evenly'
            align='center'
            pad={{ horizontal: 'large', vertical: 'small' }}
        >
            <Box direction='row' gap='small'>
                <Logo src={cngei} />
                <Logo src={branca} />
            </Box>
            <Box
                background='white'
                pad={{ horizontal: 'medium' }}
                margin={{ vertical: 'small' }}
                round='medium'
            >
                <Heading margin={{ bottom: "small" }} color='brand' level={1} textAlign='center'>CNGEI</Heading>
                <Heading level={2} textAlign='center'>Grande Gara Geodistribuita</Heading>
                <Heading level={3}>
                    Hai terminato tutte le sfide!
                    Gli staff stanno controllando le tue risposte prima di pubblicare la classifica finale!
                </Heading>
            </Box>
        </Box>
    )
}

export default Home
