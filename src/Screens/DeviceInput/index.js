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
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {authenticateUser} from '../../Constants'

const DeviceInput = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [id, setId] = useState('1182061')

  const seeResult = async () => {
    if (id) {
      navigation.navigate('Result', {id})
    }
  }

  useEffect(() => {
    authenticateUser()
  }, [])

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
        Scan With Bluetooth Device
      </Text>
        <Text style={styles.label}>Scan Id</Text>
        <TextInput
          autoFocus={true}
          style={styles.input}
          value={id}
          onChangeText={setId}
          onSubmitEditing={seeResult}
        />
        <View style={{marginVertical: 12}} />
        <TouchableOpacity
          onPress={seeResult}
          style={styles.btn}
          disabled={id === ''}
          activeOpacity={1.0}
        >
          <Text style={styles.btnLable}>See Result</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default DeviceInput

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
