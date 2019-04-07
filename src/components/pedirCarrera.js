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

class PedirCarrera extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.confirmar = this.confirmar.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
        initialStateViajes({sePidio: true, seConfirmo: false, calificar:false});
  }

  confirmar(){
    const {logged,initialStateViajes} = this.props;
    axios.post('http://localhost:8080/profile/confirmarCarrera',{
        num: logged.user.usuario.num_cel_u
    })
    .then((res) => {
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
        clearInterval(this.interval);
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

        });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.globalState.payload.sePidio && !(nextProps.globalState.payload.seConfirmo)){
        this.interval = setInterval(this.confirmar,3000);
    }       
  }

  componentDidMount(){
    if(this.props.globalState.payload.sePidio && !(this.props.globalState.payload.seConfirmo)){
        this.interval = setInterval(this.confirmar,3000);
    }    
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {globalState} = this.props;
    console.log(globalState);
    return (
        <>
        <Modal
          size="lg"
          show={globalState.payload.sePidio}
          onHide={this.handleClose}
          backdrop="static"
        >
          <Modal.Header closeButton={false}>
            <Modal.Title>{globalState.payload.seConfirmo?"Carrera en curso":"Pedir Carrera"}</Modal.Title>
          </Modal.Header>
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
          </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary">
                Terminar</Button>
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