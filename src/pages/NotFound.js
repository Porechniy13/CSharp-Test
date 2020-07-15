import React from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'

const NotFound = () => 
    <Container>
        <Paper>
            <h1>404</h1>
            <h2>Page not found</h2>
        </Paper>
    </Container>


export default NotFound;

const Container = styled.div`
    width: 50%;
    margin-left: 25%;
    min-height: 20vh;
    margin-top: 30vh;
    text-align: center;
`;