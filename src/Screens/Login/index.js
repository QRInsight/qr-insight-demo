import React, {Component, Fragment, useEffect, useState} from 'react'
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {login} from '../../Constants'
import {addKeyToStorage} from '../../helpers/asyncStorage'

const Login = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [email, setEmail] = useState('attari1235@gmail.com')
  const [password, setPassword] = useState('billobhai123')
  const [loading, setLoading] = useState(false)

  const loginUser = async () => {
    setLoading(true)
    try {
      const loggedIn = await login({
        email,
        password,
      })
      setLoading(false)
      console.log('loggedIn-->', loggedIn)
      addKeyToStorage('token', loggedIn.token)
      addKeyToStorage('info', loggedIn)
      navigation.navigate('ChooseScanType')
    } catch (err) {
      console.log(err.message)
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{marginHorizontal: '1%'}}>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          fontFamily: 'Poppins-SemiBold',
          color: '#000',
          margin: '10%',
        }}
      >
        Log in with your company account
      </Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        autoFocus={true}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={[styles.label, {marginTop: 20}]}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={loginUser}
      />
      <View style={{marginVertical: 12}} />
      <TouchableOpacity
        onPress={loginUser}
        style={styles.btn}
        disabled={email === '' || password === ''}
        activeOpacity={1.0}
      >
        {loading ? (
          <ActivityIndicator size={'small'} color={'#fff'} />
        ) : (
          <Text style={styles.btnLable}>Login</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Login

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
    backgroundColor: '#FF5D22',
    height: 41,
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
