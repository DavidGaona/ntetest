import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import isAuthenticated from "../redux/actions/isAuthenticated";
import axios from 'axios'

class LoginForm extends React.Component {


    constructor(props, context) {
      super(props, context);
      this.log = this.log.bind(this);
      this.onChanged = this.onChanged.bind(this);
      this.close = this.close.bind(this);
      this.changeRole = this.changeRole.bind(this);
      this.state = {
        numText:'',
        passText:'',
        result: '',
        notSucess: false,
        role: 'Usuario'  
      }
    }

    changeRole(role){
      switch(role){
        case 'Usuario':
          this.setState({
            role: 'Taxista'
          });
          break;
        case 'Taxista':
        this.setState({
          role: 'Usuario'
        });
        break;
        default:
          this.setState({
            ...this.state
          });    
      }
        
    }

    onChanged(event,name) {
        let textR = event.target.value
        switch(name){
            case 'numCel':
                return( 
                    this.setState({
                        numText: textR.replace(/[^0-9]/g, '')}))
            case 'pass':
                return(
                    this.setState({
                        passText: textR
                    })
                )                    
        }
      }



    log(){
      
      if(this.state.role === 'Usuario'){
        axios.post('http://localhost:8080/login/user',
      {
          num: this.state.numText,
          pass: this.state.passText
      }).then(res => {
          const {
            isAuthenticated,
            history, 
          } = this.props;
          isAuthenticated(res.data);
          history.push('/profile');
      }).catch((error) => {
          this.setState({
            numText:'',
            passText:'',
            result: '',
            notSucess: true 
          });
      })

      this.setState({
        numText: '',
        passText: ''
      });  
      }else{
        axios.post('http://localhost:8080/login/driver',
      {
          id_taxista: this.state.numText,
          pass: this.state.passText
      }).then(res => {
          const {
            isAuthenticated,
            history, 
          } = this.props;
          isAuthenticated(res.data);
          history.push('/profile');
      }).catch((error) => {
          this.setState({
            numText:'',
            passText:'',
            result: '',
            notSucess: true 
          });
      })

      this.setState({
        numText: '',
        passText: ''
      });  
      }
      
    }

    close(){
      this.setState({
        numText:'',
        passText:'',
        result: '',
        notSucess: false  
      });
      this.props.closeLog();  
    }

    render() {
      return (
        <>
          <Modal show={this.props.showlog} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{`Bienvenido: ${this.state.role}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {this.state.notSucess ? <Alert dismissible variant="danger">
                    <Alert.Heading>Error al iniciar sesión, contraseña o usuario incorrecto</Alert.Heading>
            </Alert>: <></>}  
            <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{this.state.role === 'Usuario'?"Num de celular":"ID"}</Form.Label>
                        <Form.Control placeholder={this.state.role === 'Usuario'?"Digite su num celular":"Digite su ID"} onChange={event => this.onChanged(event,'numCel')} value={this.state.numText}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Digite la contraseña" onChange={event => this.onChanged(event,'pass')} value={this.state.passText}/>
                    </Form.Group>
                    </Form>
            </Modal.Body>
            <Modal.Footer>
            {this.state.role === 'Usuario'?<Button variant="primary" onClick={(e) => this.changeRole(this.state.role)}>
                Taxista
              </Button>:<Button variant="primary" onClick={(e) => this.changeRole(this.state.role)}>
                Usuario
              </Button>}
              <Button variant="secondary" onClick={this.close}>
                Salir
              </Button>
              <Button variant="primary" onClick={this.log}>
                Iniciar sesión
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }

  const mapStateToProps = state => ({
      ...state
  });

  const mapDispatchToProps = {
    isAuthenticated
  };

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(LoginForm));