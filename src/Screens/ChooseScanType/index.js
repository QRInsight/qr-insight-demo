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

const ChooseScanType = () => {
  const navigation = useNavigation()

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
        Choose Scan Type
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('DeviceInput')}
        style={styles.btn}
        activeOpacity={1.0}
      >
        <Text style={styles.btnLable}>Scan by Device</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Scanner')}
        style={styles.btn}
        activeOpacity={1.0}
      >
        <Text style={styles.btnLable}>Scan By Camera</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ChooseScanType

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
    marginVertical: 12,
  },
})
