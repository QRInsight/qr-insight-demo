import React, {Component, Fragment} from 'react'
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import styles from './style'
import {authenticateUser} from '../../Constants'
class Scanner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scan: true,
      ScanResult: false,
      result: null,
    }
  }

  componentDidMount () {
    console.log('this.props.navigation.params---->', this.props.route.params)
    // authenticateUser()
  }
  onSuccess = e => {
    if (this.props.route.params?.forVerification) {
      this.props.navigation.navigate('OfficeLocationsAssets', {assetCode: e.data})
    } else {
      this.props.navigation.navigate('ResultAsset', {id: e.data})
      this.setState({
        result: e,
      })
    }
  }
  activeQR = () => {
    this.setState({scan: true})
  }
  scanAgain = () => {
    this.setState({scan: true, ScanResult: false})
  }

  render () {
    const {scan, ScanResult, result} = this.state
    return (
      <View style={styles.scrollViewStyle}>
        <Fragment>
          {!scan && !ScanResult && (
            <View style={styles.cardView}>
              {/* <Image source={require('./assets/camera.png')} style={{height: 36, width: 36}}></Image> */}
              <Text numberOfLines={8} style={styles.descText}>
                Please move your camera {'\n'} over the QR Code
              </Text>
              {/* <Image source={require('./assets/qr-code.png')} style={{margin: 20}}></Image> */}
              <TouchableOpacity
                onPress={this.activeQR}
                style={styles.buttonScan}
              >
                <View style={styles.buttonWrapper}>
                  {/* <Image source={require('./assets/camera.png')} style={{height: 36, width: 36}}></Image> */}
                  <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                    Scan QR Code
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {scan && (
            <QRCodeScanner
              reactivate={true}
              showMarker={true}
              ref={node => {
                this.scanner = node
              }}
              onRead={this.onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Please move your camera {'\n'} over the QR Code
                </Text>
              }
              bottomContent={
                <View>
                  <View style={styles.bottomContent}>
                    <TouchableOpacity
                      style={styles.buttonScan2}
                      onPress={() => this.scanner.reactivate()}
                      onLongPress={() => this.setState({scan: false})}
                    >
                      {/* <Image source={require('./assets/camera2.png')}></Image> */}
                    </TouchableOpacity>
                  </View>
                </View>
              }
            />
          )}
        </Fragment>
      </View>
    )
  }
}
export default Scanner
