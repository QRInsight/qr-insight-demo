import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {COLORS, fetchLocations} from '../../Constants'
import {useIsFocused, useNavigation} from '@react-navigation/native'

const OfficeLocations = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFocused) {
      getLocationsOfUser()
    }
  }, [isFocused])

  const getLocationsOfUser = async () => {
    try {
      setLoading(true)
      const locationsInfo = await fetchLocations()
      console.log('locationsInfo-->', locationsInfo?.data)
      setLocations(locationsInfo?.data)
      setLoading(false)
    } catch (err) {
      console.log('err--->', err)
      setLoading(false)
    }
  }

  //   if (loading) {
  //     return (
  //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //         <ActivityIndicator size={'large'} color={COLORS.teal} />
  //       </View>
  //     )
  //   }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Office Locations</Text>

      <FlatList
        data={locations}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OfficeLocationsAssets', {id: item._id})
              }
              style={{
                justifyContent: 'center',
                borderBottomColor: COLORS.teal,
                borderBottomWidth: 0.5,
                paddingLeft: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.desc}>{item?.address}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </SafeAreaView>
  )
}
export default OfficeLocations

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    marginLeft: 12,
    color: 'black',
    marginTop: '5%',
    fontFamily: 'Poppins-Bold',
  },
  back: {
    borderColor: COLORS.teal,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: 80,
    marginLeft: 12,
    height: 34,
    marginTop: 12,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontSize: 14,
  },
  desc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
})
