import React from 'react';
import styled from 'styled-components';
import { Card } from '@material-ui/core';
import { Lines } from 'react-preloaders';
import Axios from 'axios';

const BASE_URL = 'http://193.124.114.46:3001/';

class Logged extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            transactions: [],
            loadData: false
        }
    }

    // Navigation function
    goTo = (path) => {
        let token = localStorage.getItem("id_token_wp")
        this.props.history.push(path, token)
    }

    // Close session for this user
    exit = () => {
        localStorage.removeItem("id_token_wp")
        this.props.history.push('/')
    }

    // Get logged transactions list
    componentDidMount = () => {
        Axios.get(`${BASE_URL}api/protected/transactions`, { headers: {"Authorization" : `Bearer ${localStorage.getItem("id_token_wp")}`} })
        .then((res) => {
            this.setState({
                transactions: res.data.trans_token,
                loadData: true
            })
        })
        .catch((error) => {
            this.props.history.push('/error', {errorMessage: "Unauthorized user"})
        })
    }

    render() {
        let { transactions, loadData } = this.state
        let transactionsList;
        if(!loadData){
            transactionsList = (
                <Log>
                    <Lines background="blur" />
                    <Card>
                        <IdField>
                            Transaction ID
                        </IdField>
                        <RecipientField>
                            Recipient
                        </RecipientField>
                        <AmountField>
                            Amount
                        </AmountField>
                        <DateField>
                            Date/time
                        </DateField>
                    </Card>
                </Log>
            )
        } else {
            transactionsList = (
                <Log>
                    <Card>
                        <IdField>
                            Transaction ID
                        </IdField>
                        <RecipientField>
                            Recipient
                        </RecipientField>
                        <AmountField>
                            Amount
                        </AmountField>
                        <DateField>
                            Date/time
                        </DateField>
                    { transactions.map((item, index) => {
                        return (
                            <div key={index}>
                                <IdField>
                                    {item.id}
                                </IdField>
                                <RecipientField>
                                    {item.username}
                                </RecipientField>
                                <AmountField>
                                    {item.amount}
                                </AmountField>
                                <DateField>
                                    {item.date}
                                </DateField>
                            </div>
                        )
                    })}
                    </Card>
                </Log>
            )
        }
        return(
            <div>
                <Navigation>
                    <NavItem onClick={() => this.goTo("/main")}>Main Page</NavItem>
                    <NavItem onClick={() => this.goTo("/new")}>New transaction</NavItem>
                    <NavItem onClick={() => this.goTo("/logged")}>Previous transaction</NavItem>
                    <LastItem onClick={this.exit}>Exit</LastItem>
                </Navigation>
                { transactionsList }
            </div>
        )
    }
}

export default Logged;

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

const IdField = styled.div`
    width: 20%;
    height: 10vh;
    text-align: center;
    float: left;
    border-right: 1px grey inset;
    border-bottom: 1px grey inset;
`;

const RecipientField = styled.div`
    width: 40%;
    height: 10vh;
    text-align: center;
    float: left;
    border-right: 1px grey inset;
    border-bottom: 1px grey inset;
`;

const AmountField = styled.div`
    width: 20%;
    height: 10vh;
    text-align: center;
    float: left;
    border-right: 1px grey inset;
    border-bottom: 1px grey inset;
`;

const DateField = styled.div`
    width: 20%;
    height: 10vh;
    text-align: center;
    float: left;
    border-bottom: 1px grey inset;
`;

const Log = styled.div`
    width: 80%;
    margin-left: 10%;
    padding: 3vh;
    height: 90vh;
    overflow-y: scroll;
`;