import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Scanner from '../Screens/Scanner'
import Result from '../Screens/Result'
import {NavigationContainer} from '@react-navigation/native'

const Stack = createNativeStackNavigator()

function Navigator () {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Scanner' component={Scanner} />
        <Stack.Screen name='Result' component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
