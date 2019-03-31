import React, { Component } from 'react';
import '../App.css';
import axios from 'axios'
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
        this.state = {
            pidio: false
        };
        this.pedirCarrera = this.pedirCarrera.bind(this);    
    }

    pedirCarrera(){
        const {dirDestino,dirOrigen,logged} = this.props;
        axios.post('http://localhost:8080/profile/pedirCarrera',{
            num: logged.user.usuario.num_cel_u,
            coordsI: `(${dirOrigen.ln},${dirOrigen.lat})`,
            coordsF:`(${dirDestino.ln},${dirDestino.lat})`
        }).then((res) => {
            setTimeout(function(){
                axios.post('http://localhost:8080/profile/confirmarCarrera',{
                    num: logged.user.usuario.num_cel_u
                }).then((res) => {
                    console.log(res.data);
                    this.setState({
                        pidio:true
                    });    
                }).catch((err) => {
                    console.log(err.response);    
                })        
            } ,5000);    
        }).catch((err) => {
            console.log(err);    
        });
    }

    render() {
        const {dirDestino, dirOrigen} = this.props;
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
                            <Form.Control disabled={true} defaultValue={dirOrigen.name} type="text" placeholder="Seleccione origen con marcador del mapa..." />
                        </Form.Group>

                        <Form.Group controlId="formGroupEmail">
                            <Form.Label><i className="fas fa-location-arrow"></i> Hasta</Form.Label>
                            <Form.Control disabled={true} defaultValue={dirDestino.name} type="text" placeholder="Seleccione destino con marcador del mapa..." />
                        </Form.Group>
                        {this.state.pidio?<></>:<Button className="btn btn-warning" onClick={this.pedirCarrera}>PEDIR AHORA</Button>}
                    </Form>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    ...state,
    logged: state.authenticated    
});


export default connect(mapStateToProps)(FormGetTaxi);