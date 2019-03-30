import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
//importo componentes para formulario
import Carousel from 'react-bootstrap/Carousel'
import { connect } from 'react-redux'

class Direcciones extends Component {

    //Propiedades
    constructor(props) {
        super(props);
        this.state = {
          direcciones: <h3>No hay direcciones para mostrar</h3>  
        };
        this.getDir = this.getDir.bind(this);
        this.getDir();
    }

    getDir(){
      let dirs = [];
      const storage = JSON.parse(localStorage.getItem('userInfo'));
        const {showInfoAction,logged} = this.props;
        axios.get(`http://localhost:8080/dirfav/profile/${logged.user.usuario.num_cel_u}`,{
            headers: {
                    Authorization: storage.token
            }
        }).then((res) => {
                  dirs = res.data.map((value,index) => 
                  (<Carousel.Item key={index}>
                    <div className="App-box-services text-center">
                    <i className="fas fa-map-marker fa-7x"></i>
                    </div>
                      <Carousel.Caption>
                        <h3>{value.nombre_dir}</h3>
                      </Carousel.Caption>
                  </Carousel.Item>)
                  );
                  this.setState({
                    direcciones: dirs 
                  });    
                }).catch((err) => {
                    console.log(err);
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