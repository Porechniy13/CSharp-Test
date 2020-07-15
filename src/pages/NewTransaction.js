import React from 'react';
import { Paper, Input, Button, ButtonGroup, FormHelperText, FormControl } from '@material-ui/core';
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
            targetUser: '',
            amount: null,
            openUsersList: false,
            openTemplateList: false,
            users: [],
            filterUsers: [],
            readyData: false,
            amountError: false,
            amountMessage: '',
            succesfull: false,
            transactions: []
        }
    }

    // Navigation function
    goTo = (path) => {
        let token = localStorage.getItem("id_token_wp")
        this.props.history.push(path, token)
    }

    // Close contacts list
    closeList = () => {
        this.setState({
            openUsersList: false
        })
    }

    // Open contacts list
    openList = () => {
        let { users } = this.state
        this.setState({
            openUsersList: true,
            targetUser: '',
            filterUsers: users
        })
    }

    // onChange handler for target user
    handleChange = (value) => {
        this.filter(value)
        this.setState({
            targetUser: value
        })
    }

    // Choose user
    selectUser = (user) => {
        this.setState({
            targetUser: user.name
        })
        this.closeList()
    }

    // Filter users list for autocomplete form
    filter = (value) => {
        let { filterUsers, users } = this.state
        filterUsers = users.filter(item => item.name.includes(value))
        this.setState({
            filterUsers: filterUsers
        })
    }

    // Get all users list
    getUsers = () => {
        axios.post(`${BASE_URL}api/protected/users/list`, {filter: ' '}, { headers: {"Authorization" : `Bearer ${this.props.location.state}`} })
        .then((res) => {
            this.setState({
                users: res.data
            })
        })
        .catch((error) => {
            this.props.history.push("/error", {errorMessage: 'Error authentication'})
        })
    }

    // Get info for current user (sender)
    getUserData = () => {
        axios.get(`${BASE_URL}api/protected/user-info`, { headers: {"Authorization" : `Bearer ${localStorage.getItem("id_token_wp")}`} })
            .then((res) => {
                this.setState({
                    email: res.data.user_info_token.email,
                    name: res.data.user_info_token.name,
                    balance: res.data.user_info_token.balance,
                    id: res.data.user_info_token.id
                })
            })
            .catch((error) => {
                this.props.history.push('/error', {errorMessage: 'Error authentication'})
            })
    }

    getTransactions = () => {
        axios.get(`${BASE_URL}api/protected/transactions`, { headers: {"Authorization" : `Bearer ${localStorage.getItem("id_token_wp")}`} })
        .then((res) => {
            this.setState({
                transactions: res.data.trans_token
            })
        })
        .catch((error) => {
            this.props.history.push('/error', {errorMessage: "Unauthorized user"})
        })
    }
    
    // Close session for this user
    exit = () => {
        localStorage.removeItem("id_token_wp")
        this.props.history.push('/')
    }

    // Check sended data and create transaction
    createTransaction = () => {
        let { targetUser, amount, balance } = this.state
        if(amount > balance){
            this.setState({
                amountError: true,
                amountMessage: 'Insufficient funds'
            })
        } else {
            axios.post(`${BASE_URL}api/protected/transactions`, {name: targetUser, amount: amount}, {headers: {"Authorization" : `Bearer ${this.props.location.state}`}})
            .then((res) => {
                this.setState({
                    succesfull: true
                })
            })
            .catch((error) => {
                this.props.history.push('/error', {errorMessage: "Transaction error"})
            })
        }
    }

    // Open selection template of logged transaction window
    chooseTransaction = () => {
       this.setState({
           openTemplateList: true
       })
    }

    // Save recipient data from 
    // template mode
    chooseTemplate = (name, amount) => {
        this.setState({
            openTemplateList: false,
            readyData: true,
            targetUser: name,
            amount: amount
        })
    }

    // Handler for amount form (RegExp validate)
    // and check for errors
    handleAmount = (value) => {
        if(/^[0-9, \b]*$/.test(value)){
            this.setState({
                amount: value,
                amountError: false,
                readyData: true
            })
        } else {
            this.setState({
                amountError: true,
                amountMessage: 'Incorrect symbol'
            })
        }
    }

    // Check authorization
    componentDidMount = () => {
        if(this.props.location.state !== localStorage.getItem("id_token_wp")){
            this.props.history.push('/error', {errorMessage: 'Unauthorized user'})
        } else {
            this.getUsers()
            this.getUserData()
            this.getTransactions()
        }
    }

    render() {
        const { transactions, succesfull, targetUser, openUsersList, filterUsers, amount, readyData, amountError, amountMessage, openTemplateList } = this.state
        let filterUsersList;
        let amountField;
        let button;
        let modalSucceded;
        let templateList;
        if(openUsersList){
            filterUsersList = (
                <UsersList>
                    <Paper>
                    {filterUsers.map((item, index) => {
                        return (
                            <Contact key={index} onClick={(event) => this.selectUser(item)}>{item.name}</Contact>
                        )
                    })}
                    </Paper>
                </UsersList>
            )
        } else {
            filterUsersList = (
                <div>
                    
                </div>
            )
        }        
        if(amountError){
            amountField = (
                <div>
                    <FormControl error>
                        <Input value={amount} onChange={(event) => this.handleAmount(event.target.value)} placeholder="Amount"></Input>
                        <FormHelperText style={{textAlign: "center"}}>{amountMessage}</FormHelperText>
                    </FormControl>
                </div>
            )
        } else {
            amountField = (
                <div>
                    <Input value={amount} onChange={(event) => this.handleAmount(event.target.value)} placeholder="Amount"></Input>
                </div>
            )
        }       
        if(readyData){
            button = (
                <ButtonBlock>
                    <ButtonGroup variant="contained" color="primary">
                        <Button variant="contained" color="primary" onClick={this.createTransaction}>Create transaction</Button>
                        <Button variant="contained" color="primary" onClick={this.chooseTransaction}>Template selection</Button>
                    </ButtonGroup>
                </ButtonBlock>
            )
        } else {
            button = (
                <ButtonBlock>
                    <ButtonGroup>
                        <Button variant="contained" color="primary" disabled>Create transaction</Button>
                        <Button variant="contained" color="primary" onClick={this.chooseTransaction}>Template selection</Button>
                    </ButtonGroup>
                </ButtonBlock>
            )
        }
        if(succesfull){
            modalSucceded = (
                <Modal>
                    <ModalBody>
                        <Paper>
                            <h2>Transaction succeded!</h2>
                            <Button onClick={(event) => this.goTo("/main")} variant="contained" color="primary">OK</Button>
                        </Paper>
                    </ModalBody>
                </Modal>
            )
        }
        if(openTemplateList){
            templateList = (
                <Modal>
                    <Templates>
                        <Paper>
                            <h2>Choose the template</h2>
                            {transactions.map((item, index) => {
                                if(item.amount < 0){
                                    return(
                                        <Template onClick={(event) => this.chooseTemplate(item.username, Math.abs(item.amount))}>
                                            <h2>To: {item.username}, amount: {Math.abs(item.amount)}</h2>
                                        </Template>
                                    )
                                }                                
                            })}
                        </Paper>
                    </Templates>
                </Modal>
            )
        }
        return(
            <Container>      
                {modalSucceded}    
                {templateList}      
                <Navigation>
                    <NavItem onClick={() => this.goTo("/main")}>Main Page</NavItem>
                    <NavItem onClick={() => this.goTo("/new")}>New transaction</NavItem>
                    <NavItem onClick={() => this.goTo("/logged")}>Previous transaction</NavItem>
                    <LastItem onClick={this.exit}>Exit</LastItem>
                </Navigation>
                <Transaction>
                    <Paper>
                        <Title><h1>New transaction</h1></Title>
                        <Input value={targetUser} onChange={(event) => this.handleChange(event.target.value)} onFocus={this.openList} placeholder="Recipient"></Input>
                        {filterUsersList}
                        {amountField}
                        {button}
                    </Paper>
                </Transaction>
            </Container>
        )
    }
}

export default MainPage;

const Container = styled.div`
    width: 100%;
    height: 100vh;
`;

const Navigation = styled.div`
    width: 100%;
    background: #6699cc;
    height: 10vh;
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

const Transaction = styled.div`
    width: 50%;
    margin-left: 25%;
    text-align: center;
    padding: 2vh;
`;

const UsersList = styled.div`
    position: absolute;
    width: 14%;
    margin-left: 17%;
    max-height: 25vh;
    overflow-y: scroll; 
    overflow-x: hidden;
    z-index: 999;
`;

const Contact = styled.h3`
    cursor: pointer;
    border-bottom: 1px grey solid;
`;

const Title = styled.div`
    width: 100%;
    height: 10vh;
    text-align: center;
    border-bottom: 1px grey solid;
`;

const ButtonBlock = styled.div`
    width: 50%;
    margin-left: 25%;
    margin-top: 3vh;
    margin-bottom: 3vh;
`;

const Modal = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
`;

const ModalBody = styled.div`
    position: relative;
    left: 40%;
    top: 40vh;
    width: 20%;
    height: 20vh;
    text-align: center;
`;

const Templates = styled.div`
    position: relative;
    left: 30%;
    top: 40%;
    width: 40%;
    min-height: 10vh;
    max-height: 30vh;
    text-align: center;
    overflow-y: scroll;
`;

const Template = styled.div`
    position: relative;
    width: 100%;
    cursor: pointer;
    height: 9vh;
    border-top: 1px grey solid;
    border-bottom: 1px grey solid;
    padding-top: 1vh;
`;