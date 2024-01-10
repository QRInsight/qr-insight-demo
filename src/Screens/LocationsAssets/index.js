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
import {COLORS, fetchAssetsByLocations, fetchLocations} from '../../Constants'
import {useIsFocused, useNavigation} from '@react-navigation/native'

const OfficeLocationsAssets = ({route}) => {
  const id = route?.params?.id
  const assetCode = route?.params?.assetCode
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFocused) {
      if (locations.length === 0) {
        getAssetsByLocation()
      }
      if (assetCode) {
        console.log('assetCode-->', assetCode)
      }
    }
  }, [isFocused])

  const getAssetsByLocation = async () => {
    try {
      setLoading(true)
      const locationsInfo = await fetchAssetsByLocations(id)
      // console.log('locationsInfo-->', locationsInfo?.data)
      setLocations(locationsInfo?.data)
      setLoading(false)
    } catch (err) {
      // console.log('err--->', err)
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
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} color={COLORS.teal} />
        </View>
      ) : null}
      <FlatList
        data={locations}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                borderBottomColor: COLORS.teal,
                borderBottomWidth: 0.5,
                paddingLeft: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={styles.name}>{item?.assetName}</Text>
              <Text style={styles.desc}>{item?.assetCode}</Text>
            </TouchableOpacity>
          )
        }}
      />

      <TouchableOpacity
        style={{
          height: 45,
          backgroundColor: COLORS.teal,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Scanner', {forVerification: true})}
      >
        <Text style={{color: '#fff', fontFamily: 'Poppins-SemiBold'}}>
          Scan and Verify
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
export default OfficeLocationsAssets

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
