import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MapView, Location } from 'expo'
const { Marker, Polyline } = MapView
import Monitor from './Monitor' 
import Pin from './Pin'
import * as turf from '@turf/turf'
import _ from 'lodash'
import moment from 'moment'

const distanceBetween = (origin , destination) => {
  const from = turf.point([origin.coords.longitude, origin.coords.latitude]);
  const to = turf.point([destination.coords.longitude, destination.coords.latitude]);
  const options = {units: 'meters'};
  
  const distance = turf.distance(from, to, options);
  return _.round(distance)
}

const calculatePace = (delta, prevPosition, position) => {
  const time = position.timestamp - prevPosition.timestamp
  const pace = time / delta

  return pace 
}

export default class Running extends React.Component {
  map = React.createRef()
  state = {
    positions : [],
    distance  : 0,
    pace      : 0
  }

  async componentDidMount() {
    this.listner = await Location.watchPositionAsync({
      enableHighAccuracy: true, 
      timeInterval: 1000, 
      distanceInterval: 1
    }, this.onPositionChange)
  }

  componentWillUnmount() {
    this.listner.remove()
  }

  onPositionChange = (position) => {
    this.map.current.animateToCoordinate(position.coords, 1000)

    const { latitude, longitude } = this.props 
    const lastPosition = this.state.positions.length === 0 ? { coords: { latitude, longitude }} : this.state.positions[this.state.positions.length - 1]
    const delta = distanceBetween(lastPosition, position)
    const distance = this.state.distance + delta
    const pace = delta > 0 ? calculatePace(delta, lastPosition, position) : 0
    
    this.setState({
      positions: [...this.state.positions, position],
      distance,
      pace
    })
  }
   
  render() {
    const { latitude, longitude, distance: totalDistance } = this.props 
    const { positions, distance, pace } = this.state 
    const currentPosition = positions.length === 0 ? { coords: { latitude, longitude } } : positions[positions.length-1]
    
    return (
      <View style={styles.container}>
        <Monitor {...{distance, pace, totalDistance}} />
        <MapView 
          ref={this.map}
          provide='google' 
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.01
          }}
        >
          <Marker coordinate={currentPosition.coords}>
            <Pin />
          </Marker>
          <Polyline 
            coordinates={positions.map(position => position.coords)} 
            anchor={{x: 0.5, y: 0.5}}
            strokeWidth={12}
            strokeColor='#f5cd79'
          />
        </MapView>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
});
