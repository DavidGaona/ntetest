import React, { Component } from 'react'
import '../App.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import axios from 'axios'
import initialStateViajes from '../redux/actions/initialStateViajes'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Calificacion from './calificacion'

class PedirCarrera extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.confirmar = this.confirmar.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.terminar = this.terminar.bind(this);
    this.state = {
      nombreCompleto:'',
      numeroCelTaxista:'',
      placa:'',
      marcaModelo:'',
      numeroDeViajes:'',
      puntaje:''
    };
  }

  handleClose(){
    const {initialStateViajes} = this.props;
        initialStateViajes({sePidio: false, seConfirmo: false, calificar:false});
  }

  terminar(){
    const {logged,initialStateViajes} = this.props;
    axios.post('http://localhost:8080/profile/notificarCarreraTerminada',{
      num: logged.user.usuario.num_cel_u 
    })
    .then((res) => {
      clearInterval(this.interval);
      alert(`${res.data.message} \n Costo: ${res.data.costo}`);
      initialStateViajes({
        sePidio: false, seConfirmo: false, calificar:true    
      });  
    })
    .catch((err) => {
      console.log(err.response);
    });   
  }

  confirmar(){
    const {logged,initialStateViajes} = this.props;
    axios.post('http://localhost:8080/profile/confirmarCarrera',{
        num: logged.user.usuario.num_cel_u
    })
    .then((res) => {
        clearInterval(this.interval);
        initialStateViajes({
          sePidio: true, seConfirmo: true, calificar:false    
        });
        this.setState({
          nombreCompleto:res.data.vistaDeTaxista.nombreCompleto,
          numeroCelTaxista:res.data.vistaDeTaxista.numeroCelTaxista,
          placa:res.data.vistaDeTaxista.placa,
          marcaModelo:res.data.vistaDeTaxista.marcaModelo,
          numeroDeViajes:res.data.vistaDeTaxista.numeroDeViajes,
          puntaje:res.data.vistaDeTaxista.puntaje
        })
    })
    .catch((err) => {
      console.log(err.response);
    })      
  }


  componentWillMount(){ 
      const {initialStateViajes,logged} = this.props;
      const storage = JSON.parse(localStorage.getItem('userInfo'));
      axios.get(`http://localhost:8080/profile/revisarEstado/${logged.user.usuario.num_cel_u}`,{
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
            initialStateViajes({});
        });
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.globalState);
    if(nextProps.globalState.payload.sePidio && !(nextProps.globalState.payload.seConfirmo)){
        this.interval = setInterval(this.confirmar,3000);
    }
    if(nextProps.globalState.payload.seConfirmo && !(nextProps.globalState.payload.calificar)){
      this.interval = setInterval(this.terminar,3000);
    }       
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {globalState,logged} = this.props;
    return (
        <>
        
        <Modal
          size="lg"
          show={globalState.payload.sePidio}
          onHide={this.handleClose}
          backdrop="static"
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{globalState.payload.calificar?"Carrera Terminada: Por favor califique el servicio prestado por el taxista":globalState.payload.seConfirmo?"Carrera en curso":"Pedir Carrera"}</Modal.Title>
          </Modal.Header>
          {globalState.payload.calificar?<Modal.Body><Calificacion numCel={logged.user.usuario.num_cel_u} handleClose={this.handleClose}></Calificacion></Modal.Body>:
          <Modal.Body>
          {globalState.payload.seConfirmo?<Container>
                                                                                          <Row>
                                                                                            <Col sm>Nombre completo: </Col>
                                                                                            <Col sm>{this.state.nombreCompleto}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Numero Cel Taxista: </Col>
                                                                                            <Col sm>{this.state.numeroCelTaxista}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Placa: </Col>
                                                                                            <Col sm>{this.state.placa}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Marca modelo: </Col>
                                                                                            <Col sm>{this.state.marcaModelo}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>Numero de viajes realizados</Col>
                                                                                            <Col sm>{this.state.numeroDeViajes}</Col>
                                                                                          </Row>
                                                                                          <Row>
                                                                                            <Col sm>puntaje</Col>
                                                                                            <Col sm>{this.state.puntaje}</Col>
                                                                                          </Row>
                                                                                        </Container>:<h3>ESPERANDO CONFIRMACIÓN DEL TAXISTA....</h3>}
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
          </div>
          </Modal.Body>}
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
      </>
        );
      }
    }


    const mapDispatchToProps = {
        initialStateViajes
    };

    const mapStateToProps = state => ({
        logged: state.authenticated,
        globalState: state.initialStateViajes
    });
    
    
export default connect(mapStateToProps,mapDispatchToProps)(PedirCarrera);