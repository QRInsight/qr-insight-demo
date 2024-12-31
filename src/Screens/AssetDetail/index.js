import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, TxtWeight, fetchAssetDetailsById} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';

// Mock Data for Asset Details
const keyToNameMapping = {
  id: 'Asset ID',
  uid: 'Unique ID',
  IsDisposed: 'Disposed',
  IsInPosession: 'In Possession',
  IsActive: 'Active',
  Created: 'Creation Date',
  Updated: 'Last Updated',
  Value: 'Inventory Number',
  Name: 'Asset Name',
  Description: 'Description',
  IsOwned: 'Owned',
  AssetActivationDate: 'Activation Date',
  Locationdescription: 'Location',
  'M_Locator_ID.identifier': 'Locator',
  'CreatedBy.identifier': 'Created By',
  'UpdatedBy.identifier': 'Updated By',
  'AD_Org_ID.identifier': 'Organization',
  'M_Product_ID.identifier': 'Product',
  'A_Asset_Group_ID.identifier': 'Asset Group',
  'C_Project_ID.identifier': 'Project',
  'A_Asset_Status.identifier': 'Asset Status',
  'A_Asset_Action.identifier': 'Asset Action',
};

const getFriendlyName = key => keyToNameMapping?.[key] || key;

const AssetDetail = () => {
  const [assetData, setAssetData] = useState(null); // State to store API data
  const [loading, setLoading] = useState(false); // Loading state
  const [assetNumber, setAssetNumber] = useState('1000826'); // Input value for asset number
  const navigation = useNavigation();

  const handleFetchAssetDetails = async () => {
    if (!assetNumber) {
      Alert.alert('Error', 'Please enter an Asset Number.');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAssetDetailsById(assetNumber); // Call the API function
      setAssetData(data); // Set the fetched asset data
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch asset details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container onBack={() => navigation.goBack()} title="Asset Detail">
      {/* Input Field with Camera Button */}
      <View style={styles.inputView}>
        <Input
          placeholder="Asset Number"
          value={assetNumber}
          onChangeText={text => setAssetNumber(text)}
          containerSyle={styles.inputContainer}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleFetchAssetDetails}
          disabled={loading}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {/* Displaying Asset Details */}
      {assetData ? (
        <View>
          {Object.keys(assetData).map((key, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.labelContainer}>
                <Txt mt={3} color="#000" weight={TxtWeight.Light}>
                  {typeof assetData[key] === 'object'
                    ? assetData[key]?.propertyLabel || '-'
                    : assetData[key] || '-'}
                </Txt>
              </View>
              <View style={styles.valueContainer}>
                <Txt>
                  {typeof assetData[key] === 'object'
                    ? assetData[key]?.identifier || '-'
                    : assetData[key] || '-'}
                </Txt>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Txt mt={10} color="#777" center>
          No asset data available. Please search using the camera icon.
        </Txt>
      )}
    </Container>
  );
};

export default AssetDetail;

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
