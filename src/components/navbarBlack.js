import React, { Component } from 'react'
import '../App.css'
import axios from 'axios'

//importo componentes para la barra de navegación
import Navbar from 'react-bootstrap/Navbar'
import Brand from 'react-bootstrap/NavbarBrand'
import Nav from 'react-bootstrap/Nav'
import Link from 'react-bootstrap/NavLink'
import LoginForm from './loginForm'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { connect } from 'react-redux'
import loginForm from '../redux/actions/loginForm'
import isLogOut from '../redux/actions/isLogOut'
import showDirectionsAction from '../redux/actions/showDirectionsAction'
import showInfoAction from '../redux/actions/showInfoAction'

import { withRouter } from 'react-router-dom'

class NavbarBlack extends Component {

    constructor(props){
        super(props);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.showDirForm = this.showDirForm.bind(this);
    }

    showDirForm(){
        let dirs = [];
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showDirectionsAction,logged} = this.props;
        axios.get(`http://localhost:8080/dirfav/profile/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                 const {showDirectionsAction} = this.props;
                 showDirectionsAction(true,res.data);   
                }).catch((err) => {
                    console.log(err);
                });    
    }

    showInfo(){
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showInfoAction,logged} = this.props;
        axios.get(`http://localhost:8080/profile/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                    const respuesta = {
                        ...res.data,
                        role: storage.usuario.role    
                    };
                    showInfoAction(true,respuesta);    
                }).catch((err) => {
                    showInfoAction(false,{});
                });  
    }

    openForm(){
        const { loginForm } = this.props;
        loginForm(true);
    }

    closeForm(){
        const {loginForm} = this.props;
        loginForm(false);    
    }


    logOut(){
        const {isLogOut} = this.props;
        isLogOut();
        this.props.history.push('/');     
    }

    render() {
        const {logged} = this.props;
        console.log(logged);
        return (
            <Navbar className= "App-NavbarBlack" fixed="top" variant="dark">
            <Container>
                <Brand href="/">NoThatEasyTaxi</Brand>
                {logged.loggedIn ? <Nav className="mr-auto">
                <DropdownButton drop={'down'} variant="warning" title={`${logged.user.usuario.nombre} ${logged.user.usuario.apellido}`} id="desplegable" key="down">
                <DropdownItem eventKey="1" onClick={this.showInfo} active={false}>Perfil</DropdownItem>{logged.user.usuario.role === 'User'? <DropdownItem eventKey="2" onClick={this.showDirForm} active={false}>Modificar/Eliminar Direcciones Favoritas</DropdownItem>:<></>}</DropdownButton>
                </Nav>: <Nav className="mr-auto">
                    <Link href="/#services">Servicios</Link>
                    <Link href="/#registro">Registro</Link>
                    </Nav>}
                {logged.loggedIn ? 
                <Button variant="dark" onClick={this.logOut}>Log out</Button> : 
                <Button variant="primary" onClick={this.openForm}>Iniciar sesión</Button>}
                <LoginForm showlog={this.props.showlog} closeLog={this.closeForm}></LoginForm>
            </Container>
            </Navbar>
        );
    }


}

const mapStateToProps = state => ({
    ...state,
    logged: state.authenticated,
    showlog: state.activarLogin
});

const mapDispatchToProps = {
    isLogOut,
    loginForm,
    showInfoAction,
    showDirectionsAction
};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavbarBlack));