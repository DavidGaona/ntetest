import React, { Component } from 'react'
import '../App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { connect } from 'react-redux'
import showDirectionsAction from '../redux/actions/showDirectionsAction'

class MyDirections extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
  }


  handleClose() {
    const {showDirectionsAction} = this.props;
    showDirectionsAction(false,{});    
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
              <div>
                <Row>
                  <Col md={12}>
                    <Row>
                      <Col md={3}>
                        <i className="fas fa-user fa-7x"></i>
                      </Col>
                      <Col md={6}>
                        <Form.Group as={Row}>
                          <Form.Label column sm="3">Usuario: </Form.Label>
                          <Col sm="9">
                          <Form.Label column sm="3">{}</Form.Label>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={3}>                          
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
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