import React, { Component } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

class Pin extends Component {
  state = {
    animation: new Animated.Value(0)
  }

  componentDidMount() {
    const { animation } = this.state 

    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000
        })
      ]),
      {
        useNativeDriver: true
      }
    ).start()
  }

  render() {
    const { animation } = this.state 
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1.5]
    })
    
    return (
      <View style={styles.outerPin}>
        <View style={styles.pin}>
          <Animated.View 
            style={[
              styles.innerPin, 
              { transform: [{scale}] } 
            ]} 
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerPin: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(242, 182, 88, 0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerPin: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#f5cd79'
  }
})

export default Pin
