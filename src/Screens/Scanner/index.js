import React, {useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import {COLORS} from '../../Constants';
import {Image} from 'react-native';

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

const Scanner = () => {
  const [assetNumber, setAssetNumber] = useState('1000826');
  const [isScanning, setIsScanning] = useState(true);
  const {hasPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  // const [frameProcessor, barcodes] = useScanBarcodes([
  //   BarcodeFormat.QR_CODE,
  //   BarcodeFormat.CODE_128,
  //   BarcodeFormat.EAN_13,
  // ], {
  //   checkInverted: true,
  // });

  // const handleBarCodeScanned = useCallback((scannedBarcodes) => {
  //   if (scannedBarcodes.length > 0 && isScanning) {
  //     setIsScanning(false);
  //     const scannedValue = scannedBarcodes[0].displayValue;
  //     setAssetNumber(scannedValue);
  //     Alert.alert(
  //       'Barcode Detected',
  //       `Scanned Asset Number: ${scannedValue}`,
  //       [
  //         {
  //           text: 'Scan Again',
  //           onPress: () => setIsScanning(true),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Confirm',
  //           onPress: () => {
  //             // Handle the confirmed barcode value
  //             console.log('Confirmed asset number:', scannedValue);
  //           },
  //         },
  //       ],
  //     );
  //   }
  // }, [isScanning]);

  // // Watch for barcode updates
  // React.useEffect(() => {
  //   if (barcodes) {
  //     handleBarCodeScanned(barcodes);
  //   }
  // }, [barcodes, handleBarCodeScanned]);

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        frameProcessor={frameProcessor}
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

export default  Scanner;

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
  // ... keeping your existing styles ...
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 0,
  },
  cameraButton: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    height: 51,
    borderColor: COLORS.theme,
    backgroundColor: COLORS.bgBlue,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    height: 20,
    width: 20,
  },
  row: {
    gap: 10,
    marginVertical: 5,
    flexDirection: 'row',
  },
  labelContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.bgGrey,
    padding: 5,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  valueContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.bgGrey,
    padding: 8,
    justifyContent: 'center',
  },
});