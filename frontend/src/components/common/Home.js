import React from 'react'
import Register from '../auth/Register'
import Login from '../auth/Login'
import HomeCards from './Homepage/HomeCards'
import { isAuthenticated } from '../../lib/auth'
import { Redirect } from 'react-router-dom'

class Home extends React.Component {
state = {
  authenticated: false,
  showRegister: true
}

componentDidMount = async () => {
  if (await isAuthenticated()){
    console.log('authenticated')
    this.setState({ authenticated: true })
  }
}

renderRedirect = () => {
  if(this.state.authenticated){
    console.log('redirecting')
    return <Redirect to="/plants" />
  }
}

showFunction = (childData) => {
  this.setState({ showRegister: childData })
}

  render() {
    return (
      <>
      {this.renderRedirect()}
        <div className="columns is-vcentered">
          <div className="column is-centered">
            <div className="container is-hidden-mobile">
              <HomeCards />
            </div>
          </div>
          <div className="column">
            <img src={require("../../lib/plntify_logo.svg")} alt="Plntify Logo"></img>
            {this.state.showRegister ? <Register switchForm={this.showFunction}/> : <Login switchForm={this.showFunction}/>}          
          </div>
        </div>
      </>
    )
  }
}

export default Home