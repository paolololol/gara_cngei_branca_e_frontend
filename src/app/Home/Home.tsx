import React, { useState, useEffect } from 'react'
import { Heading, Paragraph, Box } from 'grommet'
import { Link, RouteComponentProps } from 'react-router-dom'
import DateCountdown from 'react-date-countdown-timer'
import styled from 'styled-components'
import cngei from '../../assets/cngei.png'
import quarantena from '../../assets/quarantena.png'
import branca from '../../assets/branca.png'
import './Home.css'
import State from '../../@types/State'
import { User } from '../../store/user'

const Logo = styled.img`
    max-height: 20vh;
    object-fit: contain;
`

const StyledLink = styled(Link)`
    color: white;
    font-size: 2.5em;
    font-weight: 500;
`

const Countdown: React.FC<{ setBegun: () => void }> = ({ setBegun }) => (
    <Box justify='center'>
        <Heading level={4} textAlign='center' margin='xsmall'>Mancano...</Heading>
        <DateCountdown
            callback={setBegun}
            dateTo='March 29, 2020 15:00:00 GMT+01:00'
            locales={[null, null, 'giorni', 'ore', 'minuti', 'secondi']}
            locales_plural={[null, null, 'giorni', 'ore', 'minuti', 'secondi']}
        />
    </Box>
)

interface HomeProps {
    login: State<User>
}

const Home: React.FC<HomeProps & RouteComponentProps> = ({login, history}) => {
    useEffect(() => {
        if(login && login.status === 'Success')
            history.replace('/challenge')
    }, [history, login])
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
                <Logo src={quarantena} />
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
            </Box>
            <Paragraph textAlign='center'>
                Benvenuti alla prima gara online tra pattuglie!
                La sfida avra' inizio alle ore 15 del 29 marzo
            </Paragraph>
            <Box background='brand' pad={{horizontal: 'medium', bottom: 'medium', top: 'small'}} round='small'>
                {challengeHasBegun
                    ? <StyledLink to='/login'>Inizia ora!</StyledLink>
                    : <Countdown setBegun={() => setChallengeHasBegun(true)} />
                }
            </Box>
        </Box>
    )
}

export default Home
