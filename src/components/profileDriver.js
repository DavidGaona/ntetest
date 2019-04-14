import React, { Component } from 'react';
import '../App.css';

import Container from 'react-bootstrap/Container'
import MyInfo from './myInfo'
import CarInfo from './carInfo'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Carrera from './carrera'

class profileDriver extends Component {


    constructor(props) {
        super(props);
        this.state = {
            estado: "ACTIVAR",
            color: "boton-redondo",
            enServicio: false,
            enCarrera: false,
            onConfirm: false,
            userInfo: undefined
        }
        this.activarTaxi = this.activarTaxi.bind(this);
        this.service = this.service.bind(this);
        this.start = this.start.bind(this);
        this.buscarCarrera = this.buscarCarrera.bind(this);
        this.confirmarCarrera = this.confirmarCarrera.bind(this);
        this.terminarCarrera = this.terminarCarrera.bind(this);
        this.promiseTerminarCarrera = this.promiseTerminarCarrera.bind(this);
    }



    terminarCarrera(){
        navigator.geolocation.getCurrentPosition(this.promiseTerminarCarrera);
    }

    promiseTerminarCarrera(callbackArg){
        const {logged} = this.props;
        axios.post('http://localhost:8080/taxista/terminarCarrera',{
            id_taxista: logged.user.taxista.idTaxista,
            coordsF:`(${callbackArg.coords.longitude},${callbackArg.coords.latitude})`
        })
        .then((res) => {
            alert(`${res.data.message} \n \n Ganancia de la carrera: ${res.data.costo}`);
            this.setState({
                enCarrera: false,
                onConfirm: false,
                userInfo: {}
            })
        })
        .catch((err) => {
            this.setState({
                enCarrera: false,
                onConfirm: false,
                userInfo: {}
            })
        })   
    }

    confirmarCarrera(){
        const {logged} = this.props;
        axios.post('http://localhost:8080/taxista/confirmarServicio',{
            id_taxista: logged.user.taxista.idTaxista    
        })
        .then((res) => {
            alert("La carrera ha comenzado");
            this.setState({
                onConfirm: true,
                enCarrera:true
            })
        })
        .catch((err) => {
            let message = err.response.data.message;
            message? alert(message): alert("Fatal error: 505 internal server error")
        });        
    }

    buscarCarrera(){
        const {logged} = this.props;
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        axios.post('http://localhost:8080/taxista/buscarServicio',{
            id_taxista: logged.user.taxista.idTaxista
        },{
            headers: {
                    Authorization: storage.token
        }})
        .then((res) => {
            clearInterval(this.interval);
            this.setState({
                onConfirm: true,
                userInfo: res.data.vistaDeUsuario
            }); 
        })
        .catch((err) => {  
            console.log(err.response);
        });
    }

    componentDidUpdate(){
        if(this.state.enServicio && !(this.state.enCarrera) && !(this.state.onConfirm)){
            this.interval = setInterval(this.buscarCarrera,3000);    
        }
    }


    componentDidMount(){
        if(this.state.enServicio && !(this.state.enCarrera) && !(this.state.onConfirm)){
            this.interval = setInterval(this.buscarCarrera,3000);    
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }
    
    componentWillMount(){ 
        const {logged} = this.props;
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        axios.get(`http://localhost:8080/taxista/revisarEstadoTaxista/${logged.user.taxista.idTaxista}`,{
          headers: {
                  Authorization: storage.token
          }})
          .then((res) => {
              const estado = res.data.estado;
              switch(estado){
                  case 'buscando':
                      this.setState({
                          enCarrera: false,
                          onConfirm: false,
                          enServicio: true,
                          estado: "DESACTIVAR",
                          color: "boton-redondo-gris"
                      });
                      break;
                  case 'carrera':
                      this.setState({
                          userInfo: res.data.vistaDeUsuario,
                          enCarrera: true,
                          onConfirm:true,
                          enServicio: true,
                          estado: "DESACTIVAR",
                          color: "boton-redondo-gris"
                      })
                      break;
                  default:
                      this.setState({
                          enCarrera:false,
                          enServicio:false,
                          onConfirm: false,
                          estado: "ACTIVAR",
                          color: "boton-redondo"
                      })
              }
          })
          .catch((err) => {
             this.setState({
                enCarrera:false,
                enServicio:false,
                onConfirm: false,
                estado: "ACTIVAR",
                color: "boton-redondo"
             })
          });
    }

    start(callbackArg){
        const {logged} = this.props;
        const placaValue = window.prompt("Digite el numero de la placa",'false'); 
        axios.post('http://localhost:8080/taxista/comenzarServicio',{
            id_taxista:logged.user.taxista.idTaxista,
            coordsTaxista:`(${callbackArg.coords.longitude},${callbackArg.coords.latitude})`,
            placa: placaValue
        })
        .then((res) => {
            alert(res.data.message);
            this.setState({
                enServicio: true,
                estado: "DESACTIVAR",
                color: "boton-redondo-gris"
            });
        })
        .catch((err) => {
            alert(err.response.message);
        });
    }

    service(flag){
        if(flag){
            navigator.geolocation.getCurrentPosition(this.start,(err) => {
                alert("Usted no activo la localización, no se puede prestar servicio. ");
            });    
        }else{
            const {logged} = this.props; 
            axios.put('http://localhost:8080/taxista/terminarServicio',{
                id_taxista:logged.user.taxista.idTaxista
            })
            .then((res) => {
                clearInterval(this.interval);
                alert(res.data.message);
                this.setState({
                    enServicio: true,
                    estado: "ACTIVAR",
                    color: "boton-redondo"
                });
            })
            .catch((err) => {
                clearInterval(this.interval);
                alert(err.response.message);
                this.setState({
                    enServicio: true,
                    estado: "ACTIVAR",
                    color: "boton-redondo"
                });
            });   
        }
    }

    activarTaxi() {
        if (this.state.estado === "ACTIVAR") {
            this.service(true);
        } else {
            this.service(false);
        }

    }
    render() {
        return (
            <header className="usuario_open">
                <Container className="App-padding-top">
                    <MyInfo></MyInfo>
                    <CarInfo></CarInfo>
                    <Carrera userInfo={this.state.userInfo} onConfirm={this.state.onConfirm} enCarrera={this.state.enCarrera} confirmarCarrera={this.confirmarCarrera} terminarCarrera={this.terminarCarrera}></Carrera>
                    <div className="App-header-mainTaxi">
                        <Button id="btn-servicio"
                            className={this.state.color}
                            value={this.state.estado}
                            onClick={this.activarTaxi}>
                            <i className="fas fa-taxi fa-7x"></i>
                            <h2>{this.state.estado}</h2>
                        </Button>
                    </div>
                </Container>
            </header>


        );
    }
}

const mapStateToProps = state => ({
    logged: state.authenticated
});


export default connect(mapStateToProps)(profileDriver);