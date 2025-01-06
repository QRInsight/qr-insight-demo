import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  COLORS,
  TxtWeight,
  fetchProjects,
  fetchProjectLinesById,
  updateProjectLine,
} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';
import {Dropdown} from 'react-native-element-dropdown';

const AssetVerify = ({route}) => {
  const [assetNumber, setAssetNumber] = useState(''); // Input value for asset number
  const [projects, setProjects] = useState([]); // Projects list
  const [auditItems, setAuditItems] = useState([]); // Projects list
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false); // Global loading state
  const navigation = useNavigation();

  useEffect(() => {
    if (!projects.length) {
      fetchProjectsList(); // Load projects on component mount
    }
    if (value) {
      fetchAuditsByProject();
    }
  }, [value]);

  useEffect(() => {
    if (route.params?.assetNumber) {
      setAssetNumber(route.params.assetNumber);
      updateProjectLine(route.params.assetNumber);
    }
  }, [route.params]);

  const updateProjectLine = async assetNumber => {
    await updateProjectLine(assetNumber, {Status: true});
  };
  // Fetch Projects
  const fetchProjectsList = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjects(); // Fetch all projects
      if (projectData?.length) {
        setProjects(projectData); // Update projects state
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Audits By Project
  const fetchAuditsByProject = async () => {
    try {
      setLoading(true); // Set loading state for the project
      const auditsData = await fetchProjectLinesById(value); // Fetch audits for the selected project
      setAuditItems([...auditsData]);
      setLoading(false); // Set loading state for the project
    } catch (error) {
      console.error('Error fetching audits for project:', error);
    } finally {
      setLoading(false); // Set loading state for the project
    }
  };


  return (
    <Container onBack={() => navigation.goBack()} title="Asset Audit">
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
          onPress={fetchProjects}
          disabled={loading}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <Dropdown
        data={projects?.map(data => {
          console.log('data?===>', data);
          return (
            data?.C_Project_ID?.id && {
              label:
                data?.C_Project_ID?.id + ' - ' + data?.C_Project_ID?.identifier,
              value: data.id,
            }
          );
        })}
        itemTextStyle={{color: COLORS.theme}}
        placeholderStyle={{color: '#ccc'}}
        maxHeight={300}
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />

      {/* Projects List */}

      <View style={styles.tableContainer}>
        <View
          style={{
            flex: 1,
            paddingVertical: 5,
            flexDirection: 'row',
          }}>
          <Txt style={{flex: 1}}>Asset Name</Txt>
          <Txt style={{flex: 1}}>Asset Desc</Txt>
          <Txt style={{width: 100}}>Status</Txt>
        </View>
        {auditItems.length ? (
          <View>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.theme} />
            ) : (
              auditItems?.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Scanner', {
                      lineId: item.id, // Pass line ID for updating
                    })
                  }
                  key={index}
                  style={{flex: 1, gap: 4, flexDirection: 'row'}}>
                  <Txt style={styles.txt} size={14}>
                    {item?.A_Asset_ID?.id?.toString() || 'N/A'}
                  </Txt>
                  <Txt style={styles.assetId} size={14}>
                    {item?.A_Asset_ID?.identifier || 'N/A'}
                  </Txt>

                  <View
                    style={{
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={item.Status ? images.right : images.wrong}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : null}
      </View>

      {/* Footer Summary */}
      {/* <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Txt>Total Assets</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Scanned</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Left</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Report</Txt>
          <Txt>800</Txt>
        </View>
      </View> */}
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
  projectButton: {
    padding: 10,
    backgroundColor: COLORS.bgGrey,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.theme,
    marginVertical: 5,
  },
  itemCard: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderColor: COLORS.theme,
    borderRadius: 5,
  },
  itemText: {
    paddingVertical: 2,
  },
  txt: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 2,
    marginVertical: 2,
    borderRadius: 5,
  },
  assetId: {
    flex: 2,
    paddingVertical: 3,
    marginVertical: 2,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.bgGrey,
  },
  footerItem: {
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  tableContainer: {
    borderColor: COLORS.theme,
    marginVertical: 12,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.bgGrey,
  },
});
