import React from 'react';
import { FormControl, Button, ButtonGroup, Input, Paper, FormHelperText } from '@material-ui/core';
import styled from 'styled-components';
import axios from 'axios';

const BASE_URL = 'http://193.124.114.46:3001/';

class Registration extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirm: '',
            registrationError: false,
            passwordError: false,
            error: false
        }
    }

    goBack = () => {
        this.props.history.push('/')
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

    // Check password and confirm password
    checkPassword = () => {
        let { password, confirm } = this.state
        if(password !== '' && password === confirm){
            return true
        } else {
            this.setState({
                passwordError: true
            })
            return false
        }
    }

    // Check data and send request
    newUser = () => {
        this.setState({
            loadData: true
        })
        if(this.checkEmail() && this.checkPassword()){
            let { username, email, password } = this.state
            let user = {
                username: username,
                email: email,
                password: password
            }
            axios.post(`${BASE_URL}users`, user).then(res => {
                localStorage.setItem("id_token_wp", res.data.id_token)
                this.props.history.push('/main', res.data.id_token)
            }).catch((error) => {
                this.setState({
                    registrationError: true
                })
            })
        }
    }

    // onChange handler
    handleChange = (type, value) => {
        this.setState({
            [type]: value,
            error: false,
            registrationError: false,
            passwordError: false
        })
    }   

    render() {
        const { email, password, username, confirm, error, registrationError, passwordError } = this.state
        let emailField;
        let passwordField;
        if(error){
            emailField = (
                <FormControl error>
                    <Input placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>
                    <FormHelperText>Incorrect email</FormHelperText>
                </FormControl>
            )
        } else {
            emailField = (
            <FormControl>
                <Input placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>
            </FormControl>
            )
        }
        if(passwordError){
            passwordField = (
                <div>
                <FormControl error>
                    <Input placeholder='password' value={password} onChange={(event) => this.handleChange('password', event.target.value)}></Input>
                </FormControl>
                <FormControl error>
                    <Input placeholder='confirm' value={confirm} onChange={(event) => this.handleChange('confirm', event.target.value)}></Input>
                    <FormHelperText>Passwords incorrected</FormHelperText>
                    <ButtonGroup orientation="vertical" variant="contained" color="primary" aria-label="vertical contained primary button group" style={{marginTop: '1vh', marginBottom: '1vh'}}>
                        <Button onClick={this.newUser}>Sign up</Button>
                        <Button onClick={this.goBack}>Back</Button>
                    </ButtonGroup>
                </FormControl>
                </div>
            )
        } else {
            passwordField = (
                <div>
                <FormControl>
                    <Input placeholder='password' value={password} onChange={(event) => this.handleChange('password', event.target.value)}></Input>
                </FormControl>
                <FormControl>
                    <Input placeholder='confirm' value={confirm} onChange={(event) => this.handleChange('confirm', event.target.value)}></Input>
                    <ButtonGroup orientation="vertical" variant="contained" color="primary" aria-label="vertical contained primary button group" style={{marginTop: '1vh', marginBottom: '1vh'}}>
                        <Button onClick={this.newUser}>Sign up</Button>
                        <Button onClick={this.goBack}>Back</Button>
                    </ButtonGroup>
                </FormControl>
                </div>
            )
        }
        if(registrationError){
            emailField = (
                <FormControl error>
                    <Input placeholder='email' value={email} onChange={(event) => this.handleChange('email', event.target.value)}></Input>
                    <FormHelperText>This email already used</FormHelperText>
                </FormControl>
            )
        }
        return(
            <Container>
                <Paper>
                    <Title>
                        <h1>Registartion</h1>
                    </Title>
                    <FormControl>
                        <Input placeholder='username' value={username} onChange={(event) => this.handleChange('username', event.target.value)}></Input>
                    </FormControl>
                    { emailField }
                    { passwordField }
                </Paper>
            </Container>
        )
    }
}

export default Registration;

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