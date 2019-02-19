import React from 'react';
import { StyleSheet, ActivityIndicator, Text, Alert, View, StatusBar } from 'react-native';
import { Location, Permissions } from 'expo';
import Running from './src/components/Running';


export default class App extends React.Component {
  state = {
    ready: false,
  }

  async componentWillMount() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      return Alert.alert('Oops!', 'Permission not granted.')
    }

    const { coords: { latitude, longitude} } = await Location.getCurrentPositionAsync({})
    this.setState({ ready: true, latitude, longitude })
  }

  render() {
    const { ready, latitude, longitude } = this.state
    
    return (
      <React.Fragment>
        <StatusBar barStyle='light-content'/>
        {
          ready && (
            <Running distance={1000} {...{longitude, latitude}} />
          )
        }
        {
          !ready && (
            <View style={styles.container}>
              <ActivityIndicator size='large' color='#FFF' />
            </View>
          )
        }
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303952',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
