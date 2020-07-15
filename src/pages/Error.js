import React from 'react';
import styled from 'styled-components';
import { Button, Paper } from '@material-ui/core';

class Error extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            errorText: this.props.location.state.errorMessage
        }
    }

    goBack = () => {
        this.props.history.goBack()
    }

    goToAuth = () => {
        this.props.history.push('/')
    }

    render() {
        let { errorText } = this.state
        return(
            <Container>
                <Paper>
                    <h1>{errorText}</h1>
                    <Button onClick={this.goBack}>Back</Button>
                    <Button onClick={this.goToAuth}>Auth</Button>
                </Paper>
            </Container>
        )
    }
}

export default Error;

const Container = styled.div`
    position: absolute;
    width: 20%;
    height: 20vh;
    left: 40%;
    top: 30%;
    text-align: center;
`;