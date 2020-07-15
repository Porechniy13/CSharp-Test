import React from 'react';
import { Paper } from '@material-ui/core';
import { Lines } from 'react-preloaders';
import styled from 'styled-components';
import axios from 'axios';

const BASE_URL = 'http://193.124.114.46:3001/';

class MainPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            balance: 0,
            name: '',
            id: 0,
            loadData: false
        }
    }

    // Navigation function
    goTo = (path) => {
        let token = localStorage.getItem("id_token_wp")
        this.props.history.push(path, token)
    }

    // onChange handler
    handleChange = (type, value) => {
        this.setState({
            [type]: value
        })
    }   
    
    // Remove token and close session for this user
    exit = () => {
        localStorage.removeItem("id_token_wp")
        this.props.history.push('/')
    }

    // Get profile information
    componentDidMount = () => {
        if(this.props.location.state !== localStorage.getItem("id_token_wp")){
            this.props.history.push('/error', {errorMessage: 'Unauthorized user'})
        } else {
            axios.get(`${BASE_URL}api/protected/user-info`, { headers: {"Authorization" : `Bearer ${localStorage.getItem("id_token_wp")}`} })
            .then((res) => {
                this.setState({
                    email: res.data.user_info_token.email,
                    name: res.data.user_info_token.name,
                    balance: res.data.user_info_token.balance,
                    id: res.data.user_info_token.id,
                    loadData: true
                })
            })
            .catch((error) => {
                this.props.history.push('/error', {errorMessage: 'Uncorrect request'})
            })
        }
    }

    render() {
        const { email, name, balance, loadData } = this.state
        let currentUser;
        // Check loaded data
        if(loadData){
            currentUser = (
                <Data>
                    <h2>Email:</h2>
                    <p>{email}</p>
                    <h2>Name:</h2>
                    <p>{name}</p>
                    <h2>Balance:</h2>
                    <p>{balance}</p>
                </Data>
            )
        } else {
            currentUser = (
                <Data>
                    <Lines background="blur"/>
                </Data>
            )
        }
        return(
            <Container>          
                <Navigation>
                    <NavItem onClick={() => this.goTo("/main")}>Main Page</NavItem>
                    <NavItem onClick={() => this.goTo("/new")}>New transaction</NavItem>
                    <NavItem onClick={() => this.goTo("/logged")}>Previous transaction</NavItem>
                    <LastItem onClick={this.exit}>Exit</LastItem>
                </Navigation>
                <UserInfo>
                    <Paper>
                        <Title>
                            <h1>Profile</h1>
                        </Title>
                        {currentUser}
                    </Paper>
                </UserInfo>
            </Container>
        )
    }
}

export default MainPage;

const Container = styled.div`
    width: 100%;
    height: 100vh;
`;

const Title = styled.div`
    width: 100%;
    height: 10vh;
    text-align: center;
    border-bottom: 1px grey solid;
`;

const Data = styled.div`
    width: 100%;
    padding: 3vh;
    min-height: 40vh;
`;

const Navigation = styled.div`
    width: 100%;
    background: #6699cc;
    height: 10vh;
`;

const UserInfo = styled.div`
    width: 50%;
    height: 40vh;
    margin-left: 25%;
    margin-top: 1vh;
`;

const NavItem = styled.div`
    width: 15%;
    padding-top: 2vh;
    border-right: 1px white inset;
    height: 10vh;
    text-align: center;
    float: left;
    color: white;
    :hover {
        background: #88AAcc;
        cursor: pointer;
    }
`;

const LastItem = styled.div`
    width: 15%;
    height: 10vh;
    text-align: center;
    padding-top: 2vh;
    border-left: 1px white outset;
    float: right;
    color: white;
    :hover {
        background: #88AAcc;
        cursor: pointer;
    }
`;