import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Container from '../../components/Container';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {Btn} from '../../components/Btn';
import FileViewer from 'react-native-file-viewer';

const PDFViewerScreen = ({route}) => {
  const navigation = useNavigation();
  const {base64Data} = route.params; // Receive Base64 Data

  // File Name
  const fileName = `Downloaded_PDF_${new Date().getTime()}.pdf`;

  // File Path (Downloads folder for Android, Documents for iOS)
  const filePath =
    Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${fileName}`
      : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  // 📝 Function to Save PDF File
  const savePDF = async () => {
    try {
      await RNFS.writeFile(filePath, base64Data, 'base64');
      Alert.alert('Download Complete', `File saved to:\n${filePath}`);
    } catch (error) {
      console.error('Error saving PDF:', error);
      Alert.alert('Error', 'Failed to download PDF.');
    }
  };

  // 📂 Function to Open PDF in External App
  const openPDFExternally = async () => {
    try {
      await RNFS.writeFile(filePath, base64Data, 'base64'); // Ensure file exists before opening
      await FileViewer.open(filePath, {showOpenWithDialog: true});
    } catch (error) {
      console.error('Error opening PDF externally:', error);
      Alert.alert('Error', 'Could not open PDF in external app.');
    }
  };

  return (
    <Container title="PDF Viewer" onBack={() => navigation.goBack()}>
      <ScrollView style =  {{backgroundColor : "#fff"}}>
        <Pdf
          source={{uri: `data:application/pdf;base64,${base64Data}`}}
          style={styles.pdf}
          trustAllCerts={false} // Fixes SSL issues on Android
        />

        {/* Buttons for Download & Open */}
        <View style={styles.buttonContainer}>
          {/* <Btn style={styles.btn} onPress={savePDF}>
            📥 Download PDF
          </Btn> */}
          <Btn style={styles.btn} onPress={openPDFExternally}>
            📂 Open in External App
          </Btn>
        </View>
      </ScrollView>
    </Container>
  );
};

export default PDFViewerScreen;

const styles = StyleSheet.create({
  pdf: {
    height: Dimensions.get('screen').height - 300,
    width: '100%',
  },
  buttonContainer: {
    padding: 15,
  },
  btn: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: 4,
  },
});
