import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../Constants';

const PermissionsPage = () => (
  <View style={styles.centered}>
    <Text>Please grant camera permissions to use the scanner.</Text>
  </View>
);

const NoCameraDeviceError = () => (
  <View style={styles.centered}>
    <Text>No camera device available</Text>
  </View>
);

const Scanner = ({route}) => {
  const [isScanning, setIsScanning] = useState(true);
  const navigation = useNavigation();
  const fromVerify = route?.params?.verify;
  const fromTransfer = route?.params?.fromTransfer;
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39', 'code-93'],
    onCodeScanned: codes => {
      if (codes.length > 0 && isScanning) {
        setIsScanning(false);
        console.log('scannedValue=>', codes);
        const scannedValue = codes[0]?.value; // Get the scanned value
        Alert.alert(
          'Barcode Detected',
          `Scanned Asset Number: ${scannedValue}`,
          [
            {
              text: 'Confirm',
              onPress: () => {
                if (fromTransfer) {
                  return navigation.navigate('AssetTransfer', {
                    assetNumber: scannedValue,
                  });
                }
                if (fromVerify) {
                  navigation.navigate('AssetVerify', {
                    assetNumber: scannedValue,
                  }); // Pass the scanned value
                } else {
                  navigation.navigate('AssetDetail', {
                    assetNumber: scannedValue,
                  }); // Pass the scanned value
                }
              },
            },
            {
              text: 'Scan Again',
              onPress: () => setIsScanning(true),
              style: 'cancel',
            },
          ],
        );
      }
    },
  });

  const {hasPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission && Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Camera Permission',
        message: 'This app needs camera access to scan barcodes.',
        buttonNegative: 'Deny',
        buttonPositive: 'Allow',
      });
    }
  }, [hasPermission]);

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        codeScanner={codeScanner}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.instructions}>
          Position the barcode within the frame
        </Text>
      </View>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.theme,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});
