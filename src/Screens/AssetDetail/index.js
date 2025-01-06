import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, TxtWeight, fetchAssetDetailsById} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';




const AssetDetail = () => {
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assetNumber, setAssetNumber] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.assetNumber) {
      setAssetNumber(route.params.assetNumber);
      handleFetchAssetDetails(route.params.assetNumber);
    }
  }, [route.params]);

  const handleFetchAssetDetails = async assetNumber => {
    setLoading(true);
    try {
      const data = await fetchAssetDetailsById(assetNumber); // Fetch data from API
      setAssetData(data);
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
          onPress={() => navigation.navigate('Scanner')}
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
