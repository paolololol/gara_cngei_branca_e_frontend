import React, { useState } from 'react'
import { Box, TextInput, Button, Heading } from 'grommet'

const Login: React.FC = () => {
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
                <Button
                    primary
                    label='Accedi'
                    disabled={username.length < 5 && password.length < 5}
                />
            </Box>
        </Box>
    )
}

export default Login