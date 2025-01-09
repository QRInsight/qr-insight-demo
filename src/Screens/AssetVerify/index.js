import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Dropdown} from 'react-native-element-dropdown';
import {
  COLORS,
  fetchProjects,
  fetchProjectLinesById,
  updateProjectLine,
} from '../../Constants';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';
import {images} from '../../assets';

const AssetVerify = () => {
  const [assetNumber, setAssetNumber] = useState(''); // Input value for asset number
  const [projects, setProjects] = useState([]); // Projects list
  const [auditItems, setAuditItems] = useState([]); // Audit items list
  const [selectedProject, setSelectedProject] = useState(null); // Selected project
  const [loading, setLoading] = useState(false); // Loading state
  const [isScanning, setIsScanning] = useState(true); // Camera scanning state
  const [isCameraVisible, setIsCameraVisible] = useState(false); // Toggle camera visibility
  const [isFocus, setIsFocus] = useState(false);

  const device = useCameraDevice('back'); // Camera device
  const {hasPermission} = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39', 'code-93'],
    onCodeScanned: codes => {
      if (codes.length > 0 && isScanning) {
        setIsScanning(false);
        const scannedValue = codes[0]?.value; // Get the scanned value
        if (scannedValue) {
          setAssetNumber(scannedValue); // Update asset number
          setIsCameraVisible(false); // Hide camera after scanning
          auditChosenItem();
        }
      }
    },
  });

  useEffect(() => {
    fetchProjectsList();
  }, []);

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

  const fetchProjectsList = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjects();
      if (projectData?.length) {
        setProjects(projectData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditItems = async projectId => {
    try {
      setLoading(true);
      const auditsData = await fetchProjectLinesById(projectId);
      setAuditItems([...auditsData]);
    } catch (error) {
      console.error('Error fetching audit items:', error);
    } finally {
      setLoading(false);
    }
  };

  const auditChosenItem = async () => {
    try {
      setLoading(true);
      console.log('assetNumber=>', assetNumber);
      // console.log('auditItems==>', auditItems);
      await updateProjectLine(assetNumber, {Status: true});
      await fetchAuditItems();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Please grant camera permissions to use the scanner.</Text>
      </View>
    );
  }

  return (
    <Container title="Asset Audit">
      <View style={styles.inputView}>
        <Input
          placeholder="Asset Number"
          value={assetNumber}
          keyboardType={'number-pad'}
          onChangeText={text => setAssetNumber(text)}
          containerSyle={styles.inputContainer}
          onEndEditing={event => {
            setAssetNumber(event.nativeEvent.text);
            auditChosenItem();
          }}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => setIsCameraVisible(!isCameraVisible)}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {isCameraVisible && device && (
        <Camera
          style={styles.camera}
          device={device}
          isActive={isScanning}
          codeScanner={codeScanner}
        />
      )}

      <Dropdown
        data={projects?.map(project => ({
          label:
          project?.C_Project_ID?.id + ' - ' + project?.C_Project_ID?.identifier,
          value: project.id,
        }))}
        placeholder={!isFocus ? 'Select Project' : '...'}
        searchPlaceholder="Search..."
        maxHeight={300}
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        labelField="label"
        valueField="value"
        value={selectedProject}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setSelectedProject(item.value);
          fetchAuditItems(item.value);
        }}
      />

      <View style={styles.tableContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.theme} />
        ) : (
          auditItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Txt style={styles.txt}>{item?.A_Asset_ID?.id || 'N/A'}</Txt>
              <Txt style={styles.txt}>
                {item?.A_Asset_ID?.identifier || 'N/A'}
              </Txt>
              <Image
                source={item.Status ? images.right : images.wrong}
                style={styles.statusIcon}
              />
            </View>
          ))
        )}
      </View>
    </Container>
  );
};

export default AssetVerify;

const styles = StyleSheet.create({
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
  camera: {
    height: 300,
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  tableContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txt: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
});
