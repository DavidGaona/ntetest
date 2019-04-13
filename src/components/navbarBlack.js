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
import showCarInfo from '../redux/actions/showCarInfo'
import Form from 'react-bootstrap/Form'
import { withRouter } from 'react-router-dom'

class NavbarBlack extends Component {

    constructor(props){
        super(props);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.showDirForm = this.showDirForm.bind(this);
        this.searchDir = this.searchDir.bind(this);
        this.showcarInfo = this.showcarInfo.bind(this);
        this.handler = this.handler.bind(this);
    }

    handler(e){
        const {dirsInfo} = this.props;
        if(e.target.checked){
            dirsInfo.toDelete.push(e.target.name);
        }else{
            let index = dirsInfo.toDelete.findIndex((element) => {
                return element === e.target.name
            });
            if(index !== -1){
                dirsInfo.toDelete.splice(index,1);
            }    
        }
    }

    showcarInfo(){
        const {showCarInfo} = this.props;
        showCarInfo(true);
    }

    searchDir(ln,lat){
        return axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${ln}`, {
        }).then((res) => {
          return res.data.display_name; 
        }).catch((err) => {
          console.log(err);
        });    
    }
    

    async showDirForm(){
        let dirs = [];
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showDirectionsAction,logged} = this.props;
        axios.get(`http://localhost:8080/profile/dirfav/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                 dirs = res.data.map(async (value,index) => {
                    const name = await this.searchDir(value.coords_gps_u.x,value.coords_gps_u.y);
                    return(<tr key={index}>
                    <td>
                          <Form.Check
                            custom
                            inline
                            label=""
                            type={'checkbox'}
                            id={`custom-checkbox_${index}`}
                            name={value.nombre_dir}
                            onClick={(e) => this.handler(e)}
                          />
                    </td>
                    <td>{value.nombre_dir}</td>
                    <td>{name}</td>
                    </tr>)                  
                 });
                    showDirectionsAction(true, dirs,[]); 
                }).catch((err) => {
                    return showDirectionsAction(true,[],[]);
                });

    }

    showInfo(){
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showInfoAction,logged} = this.props;
        if(logged.user.usuario){
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
        }else{
            axios.get(`http://localhost:8080/taxista/${logged.user.taxista.idTaxista}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                    const respuesta = {
                        ...res.data,
                        role: storage.taxista.role    
                    };
                    showInfoAction(true,respuesta);    
                }).catch((err) => {
                    showInfoAction(false,{});
                });    
        }  
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
        return (
            <Navbar className= "App-NavbarBlack" fixed="top" variant="dark">
            <Container>
                <Brand href="/">NoThatEasyTaxi</Brand>
                {logged.loggedIn ? <Nav className="mr-auto">
                <DropdownButton drop={'down'} variant="warning" title={logged.user.usuario?`${logged.user.usuario.nombre} ${logged.user.usuario.apellido}`:`${logged.user.taxista.nombre} ${logged.user.taxista.apellido}`} id="desplegable" key="down">
                <DropdownItem eventKey="1" onClick={this.showInfo} active={false}>Perfil</DropdownItem>{logged.user.usuario? <DropdownItem eventKey="2" onClick={this.showDirForm} active={false}>Modificar/Eliminar Direcciones Favoritas</DropdownItem>:<DropdownItem eventKey="3" onClick={this.showcarInfo} active={false}>Agregar Vehículo</DropdownItem>}</DropdownButton>
                </Nav>: <Nav className="mr-auto">
                    <Link href="/#services">Ventajas</Link>
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
    showlog: state.activarLogin,
    dirsInfo: state.showDirection
});

const mapDispatchToProps = {
    isLogOut,
    loginForm,
    showInfoAction,
    showDirectionsAction,
    showCarInfo
};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavbarBlack));