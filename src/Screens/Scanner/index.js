import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, TxtWeight, fetchAssetDetailsById} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';

// Mock Data for Asset Details

const AssetVerify = () => {
  const [assetData, setAssetData] = useState(null); // State to store API data
  const [loading, setLoading] = useState(false); // Loading state
  const [assetNumber, setAssetNumber] = useState('1000826'); // Input value for asset number
  const navigation = useNavigation();

  return (
    <Container onBack={() => navigation.goBack()} title="Scan">
      {/* Input Field with Camera Button */}

      {/* Displaying Asset Details */}
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
