import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  COLORS,
  fetchAssetHistory,
  fetchDataByCode,
  fetchDataById,
} from '../../Constants'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {SvgXml} from 'react-native-svg'

const Row = ({title, description}) => {
  return (
    <View style={styles.rowView}>
      <Text style={{fontFamily: 'Poppins-SemiBold', minWidth: 120}}>
        {title} :
      </Text>
      <Text style={{fontFamily: 'Poppins-SemiBold'}}>{description}</Text>
    </View>
  )
}
const TransactionRow = ({action, description, date}) => {
  return (
    <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
      <Text style={{fontFamily: 'Poppins-Regular', fontSize: 11, width: '35%'}}>
        {action}
      </Text>
      <Text style={{fontFamily: 'Poppins-Regular', fontSize: 11, width: '35%'}}>
        {description}
      </Text>
      <Text style={{fontFamily: 'Poppins-Regular', fontSize: 11, width: '20%'}}>
        {date}
      </Text>
    </View>
  )
}

const ResultAsset = ({route}) => {
  const id = route?.params?.id || '1182061'
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])
  const [assetInfo, setAssetInfo] = useState({})
  const [transactions, setTransactions] = useState({})
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    setApiError(false)
    if (isFocused) {
      getCodeInfo()
    }
  }, [isFocused])

  const getCodeInfo = async () => {
    try {
      setLoading(true)
      const assetInfo = await fetchDataByCode(id)
      console.log('assetInfo-->', assetInfo)
      setAssetInfo(assetInfo?.data)
      if (assetInfo) {
        const history = await fetchAssetHistory(assetInfo?.data?._id)
        console.log('history in screen->', history?.data)
        setTransactions(history?.data)
      }
      if (assetInfo) {
        setLoading(false)
      }
    } catch (err) {
      console.log('err--->', err)
      setApiError(true)
      setLoading(false)
      // navigation.goBack()
    }
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={COLORS.teal} />
      </View>
    )
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text>Back</Text>
      </TouchableOpacity>
      <FlatList
        ListHeaderComponent={
          <>
            {assetInfo?.picture ? (
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 125,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  marginVertical: '5%',
                }}
                source={{uri: assetInfo?.picture}}
              />
            ) : null}
            <Row title={'Name'} description={assetInfo?.assetName} />
            <Row
              title={'Description'}
              description={assetInfo?.assetDescription}
            />
            <Row title={'Category'} description={assetInfo?.category} />
            <Row title={'Group'} description={assetInfo?.groupDetails?.name} />
            <Row title={'Vendor'} description={assetInfo?.vendor} />
            <Row title={'Custodian'} description={assetInfo?.custodian} />
            <Row
              title={'location'}
              description={assetInfo?.locationDetails?.name}
            />

            <Text style={styles.heading}>History</Text>
          </>
        }
        data={transactions}
        style={{marginBottom: '10%'}}
        renderItem={({item, index}) => {
          return (
            <TransactionRow
              action={item.action}
              description={item.purpose}
              date={new Date(item.timestamp).toLocaleDateString()}
            />
          )
        }}
      />
    </SafeAreaView>
  )
}

export default ResultAsset

const styles = StyleSheet.create({
  type: {
    fontSize: 16,
    marginVertical: 3,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    marginVertical: 3,
    fontFamily: 'Poppins-SemiBold',
  },
  row: {
    fontSize: 16,
    marginVertical: 3,
    fontFamily: 'Poppins-Medium',
    alignItems: 'flex-start',
    marginHorizontal: 12,
  },
  heading: {
    fontSize: 24,
    marginLeft: 12,
    color: 'black',
    marginTop: '5%',
    fontFamily: 'Poppins-Bold',
  },
  rowView: {
    flexDirection: 'row',
    borderBottomColor: COLORS.teal,
    borderBottomWidth: 0.5,
    height: 52,
    alignItems: 'center',
    marginHorizontal: 12,
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
  available: {fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#323232'},
  availableInfo: {color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: 20},
})
