import React, {Component, Fragment, useEffect, useState} from 'react'
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {addKeyToStorage, getValueFromStorage} from '../../helpers/asyncStorage'
import {useNavigation} from '@react-navigation/native'

const UpdateInfo = () => {
  const navigation = useNavigation()
  const [port, setPort] = useState('')
  const [host, setHost] = useState('')
  const [protocol, setProtocol] = useState('')

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = async () => {
    setPort(await getValueFromStorage('port'))
    setHost(await getValueFromStorage('host'))
    // setProtocol(await getValueFromStorage('protocol'))
  }

  const updateCredentials = async () => {
    await addKeyToStorage('port', port)
    await addKeyToStorage('host', host)
    await addKeyToStorage('protocol', protocol)
    // navigation.navigate('ChooseScanType')
  }
  return (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          fontFamily: 'Poppins-SemiBold',
          color: '#000',
          marginVertical: '10%',
        }}
      >
        Check Credentials
      </Text>
      <ScrollView>
        <Text style={styles.label}>Ip</Text>
        <TextInput style={styles.input} value={port} onChangeText={setPort} />
        <View style={{marginVertical: 12}} />
        <Text style={styles.label}>Host</Text>
        <TextInput style={styles.input} value={host} onChangeText={setHost} />
        <View style={{marginVertical: 12}} />
        <Text style={styles.label}>Protocol</Text>
        <TextInput
          style={styles.input}
          value={protocol}
          onChangeText={setProtocol}
        />
        <View style={{marginVertical: 12}} />
        <TouchableOpacity
          onPress={updateCredentials}
          style={styles.btn}
          activeOpacity={1.0}
        >
          <Text style={styles.btnLable}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UpdateInfo

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Poppins-Medium',
    marginLeft: 12,
    color: '#000',
  },
  btnLable: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 12,
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  btn: {
    backgroundColor: '#2980b9',
    height: 41,
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
