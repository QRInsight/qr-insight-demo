import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {addKeyToStorage, getValueFromStorage} from '../../helpers/asyncStorage';
import {useNavigation} from '@react-navigation/native';
import {COLORS, TxtWeight} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import {Btn} from '../../components/Btn';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Login = () => {
  const navigation = useNavigation();
  const [port, setPort] = useState('');
  const [host, setHost] = useState('');

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    setPort(await getValueFromStorage('port'));
    setHost(await getValueFromStorage('host'));
    // setProtocol(await getValueFromStorage('protocol'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={images.bgGrey} resizeMode="stretch" style={styles.topView}>
        <Image source={images.logo} style={styles.erLogo} />
        <Image source={images.bsmLogo} style={styles.bsmLogo} />
      </ImageBackground>

      <Txt center mt={10} mb={10} size={36} weight={TxtWeight.Semi}>
        Login
      </Txt>

      <Input label={'Username'} placeholder={'Username'} />
      <Input
        label={'Password'}
        secureTextEntry={true}
        placeholder={'Password'}
      />

      <Btn style={{marginTop: 10}}>Login</Btn>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
  topView: {
    height: 220,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  erLogo: {
    alignSelf: 'flex-end',
    height: 40,
    width: 100,
    resizeMode: 'contain',
    position: 'absolute',
    right: 12,
    top: 12,
  },
  bsmLogo: {
    alignSelf: 'center',
    height: 160,
    width: 200,
    resizeMode: 'contain',
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
});
