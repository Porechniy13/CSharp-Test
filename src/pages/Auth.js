import React from 'react';
import { FormHelperText, FormControl, Button, ButtonGroup, Input, Paper } from '@material-ui/core';
import styled from 'styled-components';
import axios from 'axios';

const BASE_URL = 'http://193.124.114.46:3001/';

class Auth extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            error: false,
            authError: false,
            password: ''
        }
    }

    goToRegistration = () => {
        this.props.history.push('/registration')
    }

    // Validation email form
    checkEmail = () => {
        let { email } = this.state
        if(email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/) !== null){
            return true
        } else {
            this.setState({
                error: true
            })
            return false
        }
    }

    // Check form and send request
    auth = () => {
        if(this.checkEmail()){
            const { email, password } = this.state
            axios.post(`${BASE_URL}sessions/create`, {email: email, password: password})
            .then((res) => {
                localStorage.setItem("id_token_wp", res.data.id_token)
                this.props.history.push('/main', res.data.id_token)
            })
            .catch((error) => {
                this.setState({
                    email: '',
                    password: '',
                    authError: true
                })
            })
        }        
    }

    // onChange handler
    handleChange = (type, value) => {
        this.setState({
            [type]: value,
            error: false,
            authError: false
        })
    }

    render() {
        const { error, email, password, authError } = this.state
        let authForm;
        if(error){
            authForm = (
                <Paper> 
                    <Title>
                        <h1>Authtorization</h1>    
                    </Title>  
                    <FormControl error>
                        <Input id="email" placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>
                        <FormHelperText id="email">Incorrect email</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='password' value={password} onChange={(event) => this.handleChange('password', event.target.value)}></Input>
                        <ButtonGroup orientation="vertical" variant="contained" color="primary" aria-label="vertical contained primary button group" style={{marginTop: '1vh', marginBottom: '1vh'}}>
                            <Button onClick={this.auth}>Sign in</Button>
                            <Button onClick={this.goToRegistration}>Registration</Button>
                        </ButtonGroup>
                    </FormControl>
                </Paper>
            )
        } else {
            authForm = (
                <Paper> 
                    <Title>
                        <h1>Authtorization</h1>    
                    </Title>       
                    <FormControl>
                        <Input id="email" placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='password' value={password} onChange={(event) => this.handleChange('password', event.target.value)}></Input>
                        <ButtonGroup orientation="vertical" variant="contained" color="primary" aria-label="vertical contained primary button group" style={{marginTop: '1vh', marginBottom: '1vh'}}>
                            <Button onClick={this.auth}>Sign in</Button>
                            <Button onClick={this.goToRegistration}>Registration</Button>
                        </ButtonGroup>
                    </FormControl>
                </Paper>
            )
        }
        if(authError){
            authForm = (
            <Paper> 
                <Title>
                    <h1>Authtorization</h1>    
                </Title>  
                <FormControl error>
                    <Input id="email" placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>                    
                </FormControl>
                <FormControl error>
                    <Input placeholder='password' value={password} onChange={(event) => this.handleChange('password', event.target.value)}></Input>
                    <FormHelperText id="email">Incorrect email or password</FormHelperText>
                    <ButtonGroup orientation="vertical" variant="contained" color="primary" aria-label="vertical contained primary button group" style={{marginTop: '1vh', marginBottom: '1vh'}}>
                        <Button onClick={this.auth}>Sign in</Button>
                        <Button onClick={this.goToRegistration}>Registration</Button>
                    </ButtonGroup>
                </FormControl>
            </Paper>
            )
        }
        return(
            <Container>
                { authForm } 
            </Container>
        )
    }
}

export default Auth;

const Container = styled.div`
    position: absolute;
    width: 20%;
    height: 20vh;
    left: 40%;
    top: 30%;
    text-align: center;
`;

const Title = styled.div`
    text-align: center;
    border-bottom: 1px solid black;
`;
