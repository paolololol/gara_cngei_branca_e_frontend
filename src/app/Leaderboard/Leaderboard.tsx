import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Box, Heading, Button, Table, TableHeader, TableRow, TableCell, TableBody } from 'grommet'
import { LeaderboardEntries } from '../../store/challenge'
import State from '../../@types/State'
import {Refresh} from 'grommet-icons'

interface LeaderboardProps extends RouteComponentProps {
    getLeaderboard: () => void
    leaderboard: State<LeaderboardEntries>
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, getLeaderboard, history }) => {
    useEffect(() => {
        getLeaderboard()
    }, [getLeaderboard])
    const now = Date.now()
    const target = Date.parse('March 29, 2020 18:00:00 GMT+02:00')
    let content
    switch (leaderboard.status) {
        case ('Success'):
            content = (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell scope="col" border="bottom">
                                Ptg/eqp
      </TableCell>
                            <TableCell scope="col" border="bottom">
                                Sezione
      </TableCell>
                            <TableCell scope="col" border="bottom">
                                Gruppo
      </TableCell>
                            <TableCell scope="col" border="bottom">
                                Punteggio
      </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.data.map((x) => (
                            <TableRow>
                                <TableCell scope="row">
                                    <strong>{x.ptg}</strong>
                                </TableCell>
                                <TableCell>{x.sezione}</TableCell>
                                <TableCell>{x.gruppo}</TableCell>
                                <TableCell>{x.score}</TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            )
            break;
        case ('Loading'):
            content = 'Caricamento in corso...'
            break;
        case ('Failure'):
            content = 'Errore: prova a ricaricare la pagina :('
            break;
    }
    return (
        <Box background='white' round='medium' margin='medium' pad='medium'>
            {now < target ? <Button onClick={() => history.push('/challenge')} label='Torna alle sfide' /> : null}
            <Box direction='row'>
                <Heading margin={{ vertical: 'small' }}>Classifica</Heading>
                <Button icon={<Refresh/>} onClick={getLeaderboard}/>
            </Box>
            {content}
        </Box>
    )
}

export default Leaderboard