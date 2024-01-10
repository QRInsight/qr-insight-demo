import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Scanner from '../Screens/Scanner'
import Result from '../Screens/Result'
import {NavigationContainer} from '@react-navigation/native'
import UpdateInfo from '../Screens/UpdateCredentials'
import {useEffect, useState} from 'react'
import {addKeyToStorage, getValueFromStorage} from '../helpers/asyncStorage'
import {Text, View} from 'react-native'
import ChooseScanType from '../Screens/ChooseScanType'
import DeviceInput from '../Screens/DeviceInput'
import Login from '../Screens/Login'
import ResultAsset from '../Screens/Result-Asset'

const Stack = createNativeStackNavigator()

function Navigator () {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    updateAsyncStorageInfo()
  }, [])

  const updateAsyncStorageInfo = async () => {
    const port = await getValueFromStorage('port')
    const host = await getValueFromStorage('host')
    const protocol = await getValueFromStorage('protocol')
    if (!port) {
      await addKeyToStorage('port', '4443')
    }
    if (!host) {
      await addKeyToStorage('host', '202.163.101.237')
    }
    if (!protocol) {
      await addKeyToStorage('protocol', 'https')
    }
    setLoading(false)
  }

  return loading ? (
    <View>
      <Text>Loading......</Text>
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName='Login'
      >
        <Stack.Screen name='Login' component={Login} />
        {/* <Stack.Screen name='UpdateInfo' component={UpdateInfo} /> */}
        <Stack.Screen name='ChooseScanType' component={ChooseScanType} />
        <Stack.Screen name='ResultAsset' component={ResultAsset} />
        <Stack.Screen name='DeviceInput' component={DeviceInput} />
        <Stack.Screen name='Scanner' component={Scanner} />
        <Stack.Screen name='Result' component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
