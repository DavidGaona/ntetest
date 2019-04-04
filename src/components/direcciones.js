import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
//importo componentes para formulario
import Carousel from 'react-bootstrap/Carousel'
import { connect } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

class Direcciones extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.state = {
          direcciones: <Carousel.Item>
          <div className="App-box-services text-center">
          <h3>No hay direcciones favoritas para mostrar</h3>
          </div>
        </Carousel.Item>  
        };
        this.getDir = this.getDir.bind(this);
        this.getDir();
    }

    getDir(){
      let dirs = [];
      const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showInfoAction,logged} = this.props;
        axios.get(`http://localhost:8080/profile/dirfav/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                  dirs = res.data.map((value,index) => 
                  (<Carousel.Item key={index}>
                    <div className="App-box-services text-center">
                    <OverlayTrigger
                      trigger="hover"
                      key="right"
                      placement="right"
                      overlay={
                        <Popover
                          id="dir-popup"
                          title="Direcciones información"
                        >
                          <strong>Para mostrar mas opciones, presionar sobre el nombre de la dirección </strong>
                        </Popover>
                      }
                    >
                    <i className="fas fa-map-marker fa-7x"></i>  
                    </OverlayTrigger>
                    </div>
                      <Carousel.Caption>
                        
                        <OverlayTrigger
                      trigger="click"
                      key="top"
                      placement="top"
                      overlay={
                        <Popover
                          id="dir-on-click-popup"
                          title="Escoger una de las opciones: "
                        >
                          <strong>Para mostrar mas opciones, presionar sobre el nombre de la dirección </strong>
                        </Popover>
                      }
                    >
                    <h3>{value.nombre_dir}</h3>  
                    </OverlayTrigger>
                      </Carousel.Caption>
                    </Carousel.Item>)
                  );
                  if(dirs.length != 0){
                    this.setState({
                      direcciones: dirs 
                    });
                  }    
                }).catch((err) => {
                    console.log(err.response);
                });  
    }

    render() {
        return (
            <Carousel wrap={false} interval={null}>
            {this.state.direcciones}
            </Carousel>
        );
    }
}

const mapStateToProps = state => ({
    ...state,
    logged: state.authenticated 
});


export default connect(mapStateToProps)(Direcciones);