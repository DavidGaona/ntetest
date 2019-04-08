import React, { Component } from 'react';
import '../App.css';
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


class carreraEncontrada extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            lat: 0,
            lng: 0,
            zoom: 13,
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <>
            <Modal
                show={this.state.show}
                onHide={this.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Atención
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Carrera encontrada</h4>
                    <Form.Group as={Row} controlId="formOrigen">
                        <Form.Label column sm="2">
                            Origen
                    </Form.Label>
                        <Col sm="10">
                            <Form.Label column sm="10">
                                direccion origen
                        </Form.Label>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formDestino">
                        <Form.Label column sm="2">
                            Destino
                    </Form.Label>
                        <Col sm="10">
                            <Form.Label column sm="10">
                                direccion destino
                        </Form.Label>
                        </Col>
                    </Form.Group>

                    <Container className="map-container">
                        <LeafletMap ref={(ref) => this.map = ref} onclick={this.changePosition} style={{ height: "350px", width: "auto" }} center={position} zoom={this.state.zoom}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            />

                            <Marker position={position}>
                            </Marker>
                        </LeafletMap>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }
}


export default carreraEncontrada;