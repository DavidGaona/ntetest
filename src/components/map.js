import React, { Component } from 'react';
import '../App.css';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import Select from 'react-select';
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import FormGetTaxi from './FormGetTaxi'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


class Mapa extends Component {
  constructor(props) {
    super()
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 13,
      selectedOption: null,
      options: [],
      info: [],
      dirDestino: {},
      dirOrigen: {},
    }
    this.changePosition = this.changePosition.bind(this);
    this.showPosition = this.showPosition.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.addOrigen = this.addOrigen.bind(this);
    this.addDestino = this.addDestino.bind(this);
    navigator.geolocation.getCurrentPosition(this.showPosition);
  }


  inputChange(text) {
    axios.get(`http://nominatim.openstreetmap.org/search?format=json&limit=4&q=${text}`, {
    }).then((res) => {
      let info = [];
      let showText = [];
      res.data.forEach((element, index) => {
        info.push(element);
        showText.push({label: element.display_name, value: index});
      });
      this.setState({ options: showText, info: info });
    }).catch((err) => {
      console.log(err);
    });

  }


  handleChange = (selectedOptionAux) => {
    const { latitude, longitude } = { latitude: this.state.info[selectedOptionAux.value].lat, longitude: this.state.info[selectedOptionAux.value].lon }
    this.setState({
      lat: latitude,
      lng: longitude,
      zoom: 13,
      selectedOption: selectedOptionAux
    });
  }

  showPosition(positionCallBack) {
    this.setState({
      lat: positionCallBack.coords.latitude,
      lng: positionCallBack.coords.longitude,
      zoom: 13
    });
  }

  addOrigen() {
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.state.lat}&lon=${this.state.lng}`, {
    }).then((res) => {
      this.setState({dirOrigen: {
        name: res.data.display_name,
        lat: res.data.lat,
        ln: res.data.lon  
      }
    });
    }).catch((err) => {
      console.log(err);
    });
  }

  addDestino() {
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.state.lat}&lon=${this.state.lng}`, {
    }).then((res) => {
      this.setState({dirDestino: {
        name: res.data.display_name,
        lat: res.data.lat,
        ln: res.data.lon  
      }
    });
    }).catch((err) => {
      console.log(err);
    });
  }

  changePosition(e) {
    this.setState({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      zoom: this.map.leafletElement.getZoom()
    });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      

      <Container className="map-container">
        <Row>
          <Col md={8}>
            <LeafletMap ref={(ref) => this.map = ref} onclick={this.changePosition} style={{ height: "400px", width: "710px" }} center={position} zoom={this.state.zoom}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              />

              <Marker position={position}>
                <Popup>
                  <div>
                    <p> ¿Desea poner el marcador en esta dirección? <br /> Presione los botones para seleccionar el origen y destino</p>
                    <button className="btn btn-primary" onClick={this.addOrigen}>Desde</button>
                    <button className="btn btn-success" onClick={this.addDestino}>Hasta</button>
                  </div>
                </Popup>
              </Marker>
            </LeafletMap>
          </Col>

          <Col md={4}>
            <FormGetTaxi dirOrigen={this.state.dirOrigen} dirDestino={this.state.dirDestino}></FormGetTaxi>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.options}
              placeholder="Buscar dirección..."
              onInputChange={this.inputChange}
              filterOption={false}
            />
          </Col>
        </Row>
      </Container>);
  }
}


export default Mapa;