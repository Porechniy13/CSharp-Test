import React from 'react'
import Auth from './pages/Auth'
import Registration from './pages/Registration'
import MainPage from './pages/MainPage'
import NewTransaction from './pages/NewTransaction'
import Logged from './pages/LoggedTransaction'
import Error from './pages/Error'
import NotFound from './pages/NotFound'
import { Route, Switch } from 'react-router-dom'

const App = () => {
    return( 
        <main>      
            <Switch>      
                <Route exact path='/' component={Auth}></Route>
                <Route exact path='/registration' component={Registration}></Route>
                <Route exact path='/main' component={MainPage}></Route>
                <Route exact path='/new' component={NewTransaction}></Route>
                <Route exact path='/logged' component={Logged}></Route>
                <Route exact path='/error' component={Error}></Route>
                <Route exact path='' component={NotFound}></Route>
            </Switch>
        </main>
    )
}

export default App;