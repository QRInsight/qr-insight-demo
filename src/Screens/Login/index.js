import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {addKeyToStorage} from '../../helpers/asyncStorage';
import {useNavigation} from '@react-navigation/native';
import {TxtWeight, authenticateUser, updateToken} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import {Btn} from '../../components/Btn';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('SuperUser');
  const [password, setPassword] = useState('newpass');
  const [loading, setLoading] = useState(false);

  const submitOnLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      // Call the POST API to authenticate the user
      const authToken = await authenticateUser(username, password);

      if (authToken) {
        // Call the PUT API to update the token
        const updatedToken = await updateToken(authToken);

        // Save the final token into storage
        await addKeyToStorage('token', updatedToken);
        alert('Login successful!');
        navigation.navigate('Home'); // Navigate to the home screen or dashboard
      } else {
        alert('Failed to authenticate');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={images.bgGrey}
        resizeMode="stretch"
        style={styles.topView}>
        <Image source={images.logo} style={styles.erLogo} />
        <Image source={images.bsmLogo} style={styles.bsmLogo} />
      </ImageBackground>

      <Txt center mt={10} mb={10} size={36} weight={TxtWeight.Semi}>
        Login
      </Txt>

      <Input
        label={'Username'}
        value={username}
        onChange={txt => setUsername(txt)}
        placeholder={'Username'}
      />
      <Input
        label={'Password'}
        secureTextEntry={true}
        value={password}
        onChange={txt => setPassword(txt)}
        placeholder={'Password'}
      />

      <Btn style={{marginTop: 10}} onPress={submitOnLogin} loading={loading}>
        Login
      </Btn>
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
