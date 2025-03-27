import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/Container';
import Txt from '../../components/Txt';
import {
  fetchFixedAssetRegisterReport,
  fetchFixedAssetReceivingReport,
  fetchAssetTransferReport,
  fetchAssetSummaryReport,
} from '../../Constants'; // Import API functions
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {Btn} from '../../components/Btn';

const AssetReports = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to storage to save and open PDF files.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // No permission required on iOS
  };

  const downloadAndOpenPDF = async (base64String, fileName) => {
    try {
      if (!base64String) {
        Alert.alert('Error', 'Invalid PDF data received.');
        return;
      }
      console.log('base64Strin===>', base64String);

      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${base64String.exportFileName}` // Save to Downloads
          : `${RNFS.DocumentDirectoryPath}/${base64String.exportFileName}`; // Save to Documents on iOS

      console.log('Saving file at:', path);

      // Ensure file writing is successful
      await RNFS.writeFile(path, base64String.exportFile, 'base64')
        .then(() => console.log('File saved successfully:', path))
        .catch(err => {
          console.error('File writing error:', err);
          Alert.alert('Error', 'Failed to save the PDF.');
          return;
        });

      // Verify file existence before opening
      const fileExists = await RNFS.exists(path);
      if (!fileExists) {
        Alert.alert('Error', 'PDF file was not created.');
        return;
      }

      // Open the PDF file
      await FileViewer.open(path, {
        showOpenWithDialog: true,
        mimeType: 'application/pdf',
      });

      Alert.alert('Success', 'PDF saved and opened successfully.');
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Failed to open the PDF.');
    }
  };
  const handleReportDownload = async (fetchReportFunction, reportName) => {
    setLoading(true);
    console.log('Downloading report:', reportName);

    try {
      const report = await fetchReportFunction(); // Fetch Report Data
      console.log('Report Data:', report ? 'Received' : 'Not Received');

      if (!report || !report.exportFile) {
        Alert.alert('Error', `Failed to fetch ${reportName}`);
        return;
      }

      // Navigate to PDF Viewer Screen with Base64 data
      navigation.navigate('PDFViewerScreen', {base64Data: report.exportFile});
    } catch (error) {
      console.error(`Error fetching ${reportName}:`, error);
      Alert.alert('Error', `Failed to download ${reportName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container title="Asset Reports" onBack={() => navigation.goBack()}>
      <View style={styles.buttonContainer}>
        <Btn
          style={styles.btn}
          onPress={() =>
            handleReportDownload(
              fetchFixedAssetRegisterReport,
              'Fixed Asset Register Report',
            )
          }
          disabled={loading}>
          <Txt style={styles.buttonText}>Asset Register Report</Txt>
        </Btn>
        <Btn
          style={styles.btn}
          onPress={() =>
            handleReportDownload(
              fetchFixedAssetReceivingReport,
              'Fixed Asset Receiving Report',
            )
          }
          disabled={loading}>
          <Txt style={styles.buttonText}>Asset Receiving Report</Txt>
        </Btn>

        <Btn
          style={styles.btn}
          onPress={() =>
            handleReportDownload(
              fetchAssetTransferReport,
              'Asset Transfer Report',
            )
          }
          disabled={loading}>
          <Txt style={styles.buttonText}>Asset Transfer Report</Txt>
        </Btn>

        <Btn
          style={styles.btn}
          onPress={() =>
            handleReportDownload(
              fetchAssetSummaryReport,
              'Asset Summary Report',
            )
          }
          disabled={loading}>
          <Txt style={styles.buttonText}>Asset Summary Report</Txt>
        </Btn>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </Container>
  );
};

export default AssetReports;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  btn: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});
