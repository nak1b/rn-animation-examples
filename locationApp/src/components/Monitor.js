import React, { Component } from 'react'
import { Text, SafeAreaView, View, StyleSheet } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { Svg } from 'expo'
import SVGPath from 'art/modes/svg/path'
import * as path from 'svg-path-properties'
import moment from 'moment'

const { Path } = Svg

const radius = 100 
const padding = 10 

const d = SVGPath()
  .moveTo(padding, radius + padding)
  .arcTo(radius*2, radius + padding, radius)
  .toSVG()

const properties = path.svgPathProperties(d)
const length = properties.getTotalLength()

const formatDuration = (duration) => moment.utc(moment.duration(duration, 's').asMilliseconds()).format('mm:ss')

export default class Monitor extends Component {
  state = {
    duration: 0
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({
      duration: this.state.duration + 1
    }), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { distance, pace, totalDistance } = this.props
    const { duration } = this.state 
    const ratio = distance / totalDistance

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <Svg style={styles.progress}>
            <Path 
              stroke='#FFF' 
              fill='transparent' 
              strokeWidth={padding*2} 
              {...{ d }} 
            />
            <Path 
              stroke='#f5cd79'
              fill='transparent' 
              strokeWidth={padding*2} 
              strokeDasharray={length}
              strokeDashoffset={length - (ratio*length)}
              {...{ d }} 
            />
          </Svg>
          <View style={styles.progressLabel}>
            <Text style={styles.text}>{distance}</Text>
          </View>
        </View>
        
        <View style={styles.footer}> 
          <View style={styles.row}>
            <Icon name='watch' color='#FFF' size={30} />
            <Text style={styles.label}>{formatDuration(pace)}</Text>
          </View>
          <View style={styles.row}>
            <Icon name='clock' color='#FFF' size={30} />
            <Text style={styles.label}>{formatDuration(duration)}</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50'
  },
  progressContainer: {
    alignItems: 'center' 
  },
  progress: {
    width: radius * 2 + padding * 2,
    height: radius * 2 + padding * 2
  },
  progressLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 50,
    color: '#FFF'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 64
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 16
  }
})