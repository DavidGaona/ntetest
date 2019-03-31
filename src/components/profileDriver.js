import React, { Component } from 'react';
import '../App.css';

import Container from 'react-bootstrap/Container'
import MyInfo from './myInfo'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button';


class profileDriver extends Component {


    constructor(props) {
        super(props);
        this.state = {
            estado: "ACTIVAR",
            color: "boton-redondo"
        }
        this.activarTaxi = this.activarTaxi.bind(this);
    }

    activarTaxi() {
        if (this.state.estado === "ACTIVAR") {
            this.setState({
                estado: "DESACTIVAR",
                color: "boton-redondo-gris"
            });
        } else {
            this.setState({
                estado: "ACTIVAR",
                color: "boton-redondo"
            });
        }

    }
    render() {
        return (
            <header className="usuario_open">
                <Container className="App-padding-top">
                    <MyInfo></MyInfo>
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
    ...state
});


export default connect(mapStateToProps)(profileDriver);