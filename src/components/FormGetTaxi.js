import React, { Component } from 'react';
import '../App.css';

//importo componentes para formulario
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
class FormGetTaxi extends Component {

    //Propiedades
    constructor(props) {
        super(props);    
    }


    render() {
        const {dirDestino, dirOrigen} = this.props
        console.log(this.props.dirDestino);
        return (
            
            <Row>
                <Col md={12}>
                    <Form className="text-left text-white">
                        <Form.Group>
                            <Form.Label><i className="fas fa-taxi fa"></i> NotThatEasyTaxy</Form.Label>
                            <br />
                            <h3>Ordenar taxi</h3>
                        </Form.Group>

                        <Form.Group controlId="formGroupEmail">
                            <Form.Label><i className="fas fa-map-marker-alt"></i> Desde</Form.Label>
                            <Form.Control disabled={true} defaultValue={dirOrigen} type="text" placeholder="Seleccione origen..." />
                        </Form.Group>

                        <Form.Group controlId="formGroupEmail">
                            <Form.Label><i className="fas fa-location-arrow"></i> Hasta</Form.Label>
                            <Form.Control disabled={true} defaultValue={dirDestino} type="text" placeholder="Seleccione destino..." />
                        </Form.Group>
                        <Button className="btn btn-warning">PEDIR AHORA</Button>
                    </Form>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});


export default connect(mapStateToProps)(FormGetTaxi);