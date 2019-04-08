import React, { Component } from 'react';
import '../App.css';

import Container from 'react-bootstrap/Container'
import MyInfo from './myInfo'
import CarInfo from './carInfo'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button';
import axios from 'axios';


class profileDriver extends Component {


    constructor(props) {
        super(props);
        this.state = {
            estado: "ACTIVAR",
            color: "boton-redondo",
            enServicio: false,
            enCarrera: false
        }
        this.activarTaxi = this.activarTaxi.bind(this);
        this.service = this.service.bind(this);
        this.start = this.start.bind(this);
        this.comenzarCarrera = this.comenzarCarrera.bind(this);
    }


    comenzarCarrera(){
        const {logged} = this.props;
        axios.post('http://localhost:8080/taxista/confirmar',{
            id_taxista: logged.user.taxista.idTaxista    
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err.response);
        });        
    }

    componentWillUpdate(){
        if(this.state.enServicio){
            this.interval = setInterval(this.buscarCarrera,3000);    
        }    
    }



    //ToDo
    /*componentWillMount(){ 
        const {logged} = this.props;
        const storage = JSON.parse(localStorage.getItem('userInfo'));
        axios.get(`http://localhost:8080/taxista/revisarEstadoTaxista/${logged.user.taxista.idTaxista}`,{
          headers: {
                  Authorization: storage.token
          }})
          .then((res) => {
              const estado = res.data.estado;
              switch(estado){
                  case 'calificando':
                      initialStateViajes({
                          sePidio: true, seConfirmo: true, calificar: true    
                      });
                      break;
                  case 'solicitando':
                      initialStateViajes({
                          sePidio: true, seConfirmo: false, calificar:false    
                      });
                      break;
                  case 'carrera':
                      this.setState({
                        nombreCompleto:res.data.vistaDeTaxista.nombreCompleto,
                        numeroCelTaxista:res.data.vistaDeTaxista.numeroCelTaxista,
                        placa:res.data.vistaDeTaxista.placa,
                        marcaModelo:res.data.vistaDeTaxista.marcaModelo,
                        numeroDeViajes:res.data.vistaDeTaxista.numeroDeViajes,
                        puntaje:res.data.vistaDeTaxista.puntaje
                      });
                      initialStateViajes({
                        sePidio: true, seConfirmo: true, calificar:false    
                      });
                      break;
                  default: 
                      initialStateViajes({});
              }
          })
          .catch((err) => {
  
          });
    }*/

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
            axios.post('http://localhost:8080/taxista/comenzarServicio',{
                id_taxista:logged.user.taxista.idTaxista,
            })
            .then((res) => {
                alert(res.data.message);
                this.setState({
                    enServicio: true,
                    estado: "ACTIVAR",
                    color: "boton-redondo"
                });
            })
            .catch((err) => {
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