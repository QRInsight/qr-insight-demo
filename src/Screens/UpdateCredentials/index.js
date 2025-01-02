import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {addKeyToStorage, getValueFromStorage} from '../../helpers/asyncStorage';
import {useNavigation} from '@react-navigation/native';

const UpdateInfo = () => {
  const navigation = useNavigation();

  // State for credentials
  const [credentials, setCredentials] = useState({
    protocol: '',
    host: '',
    port: '',
    organizationId: '',
    clientId: '',
    roleId: '',
  });

  // Fetch stored values on component mount
  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    setCredentials({
      protocol: (await getValueFromStorage('protocol')) || '',
      host: (await getValueFromStorage('host')) || '',
      port: (await getValueFromStorage('port')) || '',
      organizationId: (await getValueFromStorage('organizationId')) || '',
      clientId: (await getValueFromStorage('clientId')) || '',
      roleId: (await getValueFromStorage('roleId')) || '',
    });
  };

  // Update all keys to local storage
  const updateCredentials = async () => {
    for (const [key, value] of Object.entries(credentials)) {
      await addKeyToStorage(key, value);
    }
    navigation.navigate('Login');
  };

  // Handle input changes
  const handleChange = (key, value) => {
    setCredentials(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Update Credentials</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Protocol</Text>
          <TextInput
            style={styles.input}
            value={credentials.protocol}
            onChangeText={text => handleChange('protocol', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Host</Text>
          <TextInput
            style={styles.input}
            value={credentials.host}
            onChangeText={text => handleChange('host', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Port</Text>
          <TextInput
            style={styles.input}
            value={credentials.port}
            onChangeText={text => handleChange('port', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Organization ID</Text>
          <TextInput
            style={styles.input}
            value={credentials.organizationId}
            onChangeText={text => handleChange('organizationId', text)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role ID</Text>
          <TextInput
            style={styles.input}
            value={credentials.roleId}
            onChangeText={text => handleChange('roleId', text)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client ID</Text>
          <TextInput
            style={styles.input}
            value={credentials.clientId}
            onChangeText={text => handleChange('clientId', text)}
          />
        </View>

        <TouchableOpacity
          onPress={updateCredentials}
          style={styles.btn}
          activeOpacity={0.8}>
          <Text style={styles.btnLabel}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    marginLeft: 4,
    color: '#000',
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  btn: {
    backgroundColor: '#2980b9',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnLabel: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: 16,
  },
});
