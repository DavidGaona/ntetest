import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import showDirectionsAction from '../redux/actions/showDirectionsAction'
import Table from 'react-bootstrap/Table'

class MyDirections extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      info: []
    };
  }


componentWillReceiveProps(nextProps){
  const {showDirection} = nextProps;
  Promise.all(showDirection.data).then((valores)=>{ 
    this.setState({
      info: valores
    });
  })   
}  

  handleClose() {
    const {showDirectionsAction} = this.props;
    showDirectionsAction(false,[]);    
  }


  render() {
    const {showDirection} = this.props; 
    return (
        <>
        <Modal
          size="lg"
          show={showDirection.show}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Direcciones favoritas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <Table responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Dirección favorita</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.info === 0?
                                                  <tr>
                                                    <td>Error</td>
                                                    <td>Error</td>
                                                    <td>Error</td>
                                                  </tr>:this.state.info}  
                </tbody>
              </Table>
              <Button variant="primary"><i className="fas fa-tools fa-3x"></i>Modificar</Button>
              <Button variant="danger"><i className="fas fa-trash fa-3x"></i>Eliminar</Button>
            </Form>
          </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Salir</Button>
            </Modal.Footer>
        </Modal>
      </>
        );
      }
    }

    const mapStateToProps = state => ({
        logged: state.authenticated,
        showDirection: state.showDirection
    });
    
    const mapDispatchToProps = {
        showDirectionsAction
    };


    
export default connect(mapStateToProps,mapDispatchToProps)(MyDirections);