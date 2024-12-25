import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TxtWeight } from '../../Constants';
import { images } from '../../assets';
import Txt from '../../components/Txt';
import { Input } from '../../components/TxtInput';
import Container from '../../components/Container';

// Mock Data for Asset Details
const mockData = {
  'Project': 'Project A',
  'Asset Code': 'AC-12345',
  'Asset Name': 'Laptop',
  'Asset Description': 'Dell XPS 13',
  'Asset Location': 'New York Office',
  'Employee Name': 'John Doe',
  'Department': 'IT',
  'Locator': 'Shelf B3',
  'Serviceable': 'Yes',
  'Category': 'Electronics',
};

const AssetDetail = () => {
  const navigation = useNavigation();

  return (
    <Container onBack={() => navigation.goBack()} title="Asset Detail">
      {/* Input Field with Camera Button */}
      <View style={styles.inputView}>
        <Input
          placeholder="Asset Number"
          containerSyle={styles.inputContainer}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {/* Displaying Asset Details */}
      {Object.keys(mockData).map((key, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.labelContainer}>
            <Txt mt={3} color="#000" weight={TxtWeight.Light}>
              {key}
            </Txt>
          </View>
          <View style={styles.valueContainer}>
            <Txt>{mockData[key]}</Txt>
          </View>
        </View>
      ))}
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
    height: 40,
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
    padding: 5,
    justifyContent: 'center',
  },
});
