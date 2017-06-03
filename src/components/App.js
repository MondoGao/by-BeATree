import React from 'react'

import {
  Route,
  Link,
  Switch
} from 'react-router-dom'

import styles from './App.scss'

import PageHome from 'components/PageHome'
import Scene from 'components/Scene'

class App extends React.Component {
  
  render() {
    return (
      <Switch>
        <Route path="/" exact={true} component={PageHome}/>
        <Route path="/scene" component={Scene}/>
      </Switch>
    )
  }
  
}

export default App