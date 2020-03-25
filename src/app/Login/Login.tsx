import React, { useState, useEffect } from 'react'
import { Text, Box, TextInput, Button, Heading } from 'grommet'
import { LoginData, User } from '../../store/user'
import State from '../../@types/State'
import { RouteComponentProps } from 'react-router'

interface LoginProps {
    login: (data: LoginData) => void
    restore: () => void
    user: State<User>
}

const Login: React.FC<LoginProps & RouteComponentProps> = ({login, user, history, restore}) => {
    useEffect(() => {
        restore()
    }, [restore])
    useEffect(() => {
        if(user.status === 'Success')
            history.replace('/challenge')
    }, [history, user])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <Box
            align='center'
            justify='center'
            height='100%'
            width='xlarge'
            pad={{ horizontal: 'medium' }}
        >
            <Box
                background='white'
                gap='medium'
                pad='medium'
                round='medium'
            >
                <Heading level='5' margin='small'>
                    Inserisci le credenziali che ti hanno inviato i tuoi capi
                </Heading>
                <TextInput placeholder='Codice ptg' onChange={(event) => setUsername(event.target.value)} />
                <TextInput type='password' placeholder='Password' onChange={(event) => setPassword(event.target.value)} />
                {user.status === 'Failure' && <Text color='error'>Le credenziali non sono corrette!</Text>}
                <Button
                    primary
                    onClick={() => login({identifier: username, password})}
                    label='Accedi'
                    disabled={username.length < 5 && password.length < 5}
                />
            </Box>
        </Box>
    )
}

export default Login