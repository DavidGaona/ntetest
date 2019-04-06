import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ProfileUser from '../components/profileUser'
import ProfileDriver from '../components/profileDriver'

class Profile extends Component {

  constructor(props){
    super(props);
  }


  componentWillReceiveProps(nextProps){
    const {authenticated} = nextProps;
    if(!authenticated.loggedIn){
      return this.props.history.push('/');  
    }    
  }

  componentWillMount(){
    const {authenticated} = this.props;
    if(!authenticated.loggedIn){
      return this.props.history.push('/');  
    }  
  }


  render() {
    const {authenticated} = this.props;
      return customProfile(authenticated.user)
    }
}

const customProfile = (role) => {
  if(role){
    if(role.usuario){
      return(<ProfileUser></ProfileUser>);
    }
      return(<ProfileDriver></ProfileDriver>);
  }else{
    return <h3>NOTHING TO SHOW</h3>
  }
};

const mapStateToProps = state => ({
    ...state,
    authenticated: state.authenticated
});


export default withRouter(connect(mapStateToProps)(Profile));