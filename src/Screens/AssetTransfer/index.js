import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, TxtWeight, fetchAssetDetailsById} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';
import {Dropdown} from 'react-native-element-dropdown';
import {Btn} from '../../components/Btn';
import {DropdownContext} from '../../context/DropdownContext';

// Mock Data for Asset Details
const notIclude = [
  'Updated By',
  'Created By',
  'Tenant',
  'Attribute Set Instance',
  'Parent Asset',
  'Warehouse',
  'Repairable Stautus',
  'Organization',
  'Asset Status',
  'Asset Action',
  'Asset Addition',
  'ER_Employee',
  'Department',
];

const apiEndpoints = [
  {
    label: 'To Employee',
    url: '/api/v1/models/ER_EMPLOYEE',
    fromLabel: 'From Employee',
    fromKey: 'ER_Employee_ID',
  },
  {
    label: 'To Department',
    url: '/api/v1/models/ER_DEPARTMENT',
    fromLabel: 'From Department',
    fromKey: 'ER_Department_ID',
  },
  {
    label: 'To Locator',
    url: '/api/v1/models/M_LOCATOR',
    fromLabel: 'From Locator',
    fromKey: 'M_Locator_ID',
  },
  {
    label: 'To Warehouse',
    url: '/api/v1/models/M_WAREHOUSE',
    fromLabel: 'From Warehouse',
    fromKey: 'M_Warehouse_ID',
  },
  {
    label: 'To Project',
    url: '/api/v1/models/C_PROJECT',
    fromLabel: 'From Project',
    fromKey: 'C_Project_ID',
  },
];

const AssetTransfer = ({route}) => {
  const {dropdownData, loading: dropdownLoading} = useContext(DropdownContext);
  console.log('dropdownData=>', dropdownData);
  const [assetData, setAssetData] = useState(null); // State to store API data
  const [loading, setLoading] = useState(false); // Loading state
  const [assetNumber, setAssetNumber] = useState(''); // Input value for asset number
  // const [dropdownData, setDropdownData] = useState({}); // Data for dropdowns
  const [selectedValues, setSelectedValues] = useState({}); // Selected values
  const [isDataFetched, setIsDataFetched] = useState(false); // Track if data is fetched

  const navigation = useNavigation();

  useEffect(() => {
    if (route.params?.assetNumber) {
      setAssetNumber(route.params.assetNumber);
      handleFetchAssetDetails(route.params.assetNumber);
    }
  }, [route.params, assetNumber]);

  // useEffect(() => {
  //   // Fetch data for all dropdowns
  //   const fetchDropdownData = async () => {
  //     if (isDataFetched) return; // Avoid redundant fetches
  //     setLoading(true);
  //     const authToken = await getValueFromStorage('token'); // Get token from storage
  //     const protocol = await getValueFromStorage('protocol');
  //     const host = await getValueFromStorage('host');
  //     const port = await getValueFromStorage('port');
  //     const baseUrl = `${protocol}://${host}:${port}`;
  //     try {
  //       const responses = await Promise.all(
  //         apiEndpoints.map(endpoint =>
  //           RNFetchBlob.config({trusty: true})
  //             .fetch('GET', `${baseUrl}${endpoint.url}`, {
  //               Authorization: `Bearer ${authToken}`,
  //               Accept: 'application/json',
  //             })
  //             .then(res => {
  //               const result = JSON.parse(res?.data); // Ensure JSON parsing

  //               return {
  //                 label: endpoint.label,
  //                 data: result?.records?.map(item => ({
  //                   label:
  //                     item.Name ||
  //                     item.Designation ||
  //                     item?.M_Warehouse_ID?.identifier,
  //                   value: item.id || item.code,
  //                 })),
  //               };
  //             }),
  //         ),
  //       );
  //       const dropdowns = responses.reduce(
  //         (acc, curr) => ({...acc, [curr.label]: curr.data}),
  //         {},
  //       );
  //       setDropdownData(dropdowns);
  //       setIsDataFetched(true);
  //     } catch (error) {
  //       console.log('error=>', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDropdownData();
  // }, []);

  const handleFetchAssetDetails = async () => {
    if (!assetNumber) {
      Alert.alert('Error', 'Please enter an Asset Number.');
      return;
    }

    setLoading(true);
    console.log('Fetching starts====>');
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
    <Container onBack={() => navigation.goBack()} title="Asset Transfer">
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
          onPress={() => navigation.navigate('Scanner', {fromTransfer: true})}
          disabled={loading}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size={'large'}
          style={{alignSelf: 'center', marginVertical: 10}}
        />
      ) : null}

      {/* Displaying Asset Details */}
      {assetData ? (
        <View>
          {Object.keys(assetData)?.map((key, index) =>
            typeof assetData[key] === 'object' &&
            !notIclude.includes(assetData[key]?.propertyLabel) ? (
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
            ) : null,
          )}
        </View>
      ) : (
        <Txt mt={10} color="#777" center>
          No asset data available. Please search using the camera icon.
        </Txt>
      )}

      {/* Dropdowns for APIs */}
      {assetData
        ? apiEndpoints.map((endpoint, index) => {
            console.log('endpoint.fromKey==>', endpoint.fromKey);
            return (
              <View
                key={endpoint.fromLabel}
                style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <View style={styles.dropdownContainer}>
                    <Txt
                      color={COLORS.theme}
                      weight={TxtWeight.Medium}
                      size={14}>
                      {endpoint.fromLabel}
                    </Txt>
                    <View
                      style={[
                        {
                          flex: 1,
                          justifyContent: 'center',
                          backgroundColor: COLORS.bgGrey,
                          padding: 10,
                          borderRadius: 5,
                        },
                      ]}>
                      <Txt size={14}>
                        {assetData?.[endpoint.fromKey]?.identifier}
                      </Txt>
                    </View>
                  </View>
                </View>
                <View style={{flex: 1}}>
                  <View key={endpoint.label} style={styles.dropdownContainer}>
                    <Txt
                      color={COLORS.theme}
                      weight={TxtWeight.Medium}
                      size={14}>
                      {endpoint.label}
                    </Txt>
                    <Dropdown
                      style={styles.dropdown}
                      data={dropdownData[endpoint.label] || []}
                      labelField="label"
                      valueField="value"
                      placeholder={`${endpoint.label}`}
                      value={selectedValues[endpoint.label]}
                      onChange={item =>
                        setSelectedValues(prev => ({
                          ...prev,
                          [endpoint.label]: item.value,
                        }))
                      }
                      dropdownPosition={index > 2 ? 'top' : 'bottom'}
                      disable={loading}
                    />
                  </View>
                </View>
              </View>
            );
          })
        : null}

      {assetData ? (
        <Btn
          style={{
            marginVertical: 14,
          }}>
          {' '}
          Transfer Asset{' '}
        </Btn>
      ) : null}
    </Container>
  );
};

export default AssetTransfer;

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
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
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
