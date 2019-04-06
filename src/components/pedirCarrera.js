import React, { Component } from 'react'
import '../App.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import axios from 'axios'
import initialStateViajes from '../redux/actions/initialStateViajes'

class PedirCarrera extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.confirmar = this.confirmar.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(){
    const {initialStateViajes} = this.props;
        initialStateViajes({sePidio: true, seConfirmo: false, calificar:false});
  }

  confirmar(){
    const {logged} = this.props;
    axios.post('http://localhost:8080/profile/confirmarCarrera',{
        num: logged.user.usuario.num_cel_u
    })
    .then((res) => {
        console.log(res);
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
    if(nextProps.sePidio){
        this.interval = setInterval(this.confirmar,3000);
    }       
  }

  componentDidMount(){
    if(this.props.sePidio){
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
            <Modal.Title>Pedir carrera</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <h3>ESPERANDO CONFIRMACIÓN DEL TAXISTA....</h3>
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