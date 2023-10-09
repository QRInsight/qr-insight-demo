import React, {useEffect, useState} from 'react'
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native'
import {fetchDataById} from '../../Constants'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {SvgXml} from 'react-native-svg'

const Result = ({route}) => {
  const id = route?.params?.id || '1182061'
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  console.log('id-->', id)
  console.log('route-->', route)

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])
  const [apiError, setApiError] = useState(false)
  const [availableUnits, setAvailableUnits] = useState(0)

  const types = {
    'Vendor Receipts': {
      color: '#009688',
      svg: `<svg
      fill="#009688"
      height="100"
      viewBox="0 0 24 24"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M17 3h-2c0-1.1-.9-2-2-2s-2 .9-2 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3zm-2 0h-4V2h4v1zM5 19H3v-2h2v2zm0-4H3v-2h2v2zm0-4H3V9h2v2zm0-4H3V5h2v2zm16 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2z" />
    </svg>
    `,
    },
    'Movement From': {
      color: '#FF5722',
      svg: `<svg
      fill="#FF5722"
      height="100"
      viewBox="0 0 24 24"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10h-4v-2h4v2z" />
    </svg>
    `,
    },
    'Movement To': {
      color: '#FFA726',
      svg: `<svg
      fill="#FFA726"
      height="100"
      viewBox="0 0 24 24"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12l-4-4v3H3v2h15v3z" />
    </svg>    
    `,
    },

    'Customer Shipment': {
      color: '#6200EA',
      svg: `<svg
      fill="#6200EA"
      height="100"
      viewBox="0 0 24 24"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 18H6V4h12v16zM8 12v2h2v-2h2v3h2v-3h2v-2h-2V9h-2v3H8z" />
    </svg>
     
    `,
    },
  }

  const row = (heading, desc) => {
    return (
      <Text
        style={{color: '#323232', marginTop: 4, fontFamily: 'Poppins-Medium'}}
      >
        {heading}:
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: '#000',
          }}
        >
          {'    '} {desc}
        </Text>
      </Text>
    )
  }

  useEffect(() => {
    setApiError(false)
    if (isFocused) {
      getQrInfo()
    }
  }, [isFocused])

  const getQrInfo = async () => {
    try {
      const qrInfo = await fetchDataById(id)
      setRecords(transformData(qrInfo?.records))
      setLoading(false)
    } catch (err) {
      // console.log('err--->', err)
      setApiError(true)
      setLoading(false)
      navigation.goBack()
    }
  }

  function transformData (inputData) {
    // Initialize an empty array to store the transformed data
    const transformedArray = []
    let availableUnits = 0

    // Iterate through the input data array
    inputData.forEach(item => {
      // Create a new object with the desired fields
      const transformedItem = {
        organization: item.AD_Org_ID.identifier,
        locater: item.M_Locator_ID.identifier,
        movementDate: item.MovementDate,
        product: item.M_Product_ID.identifier,
        movementType: item.MovementType.identifier,
        movementQuantity: item.MovementQty,
        receipt: item.M_InOutLine_ID ? true : false,
      }

      availableUnits += Number(item.MovementQty)

      // Push the transformed object to the result array
      transformedArray.push(transformedItem)
    })
    setAvailableUnits(availableUnits)

    return transformedArray
  }

  const renderRecords = ({item, index}) => {
    // Define styles based on the movement type and receipt
    const cardStyle = {
      padding: 10,
      margin: 5,
      marginHorizontal: 12,
      borderColor: item.receipt ? '#E0F2F1' : '#FFCCBC',
      borderWidth: 1,
      borderRadius: 7,
    }

    const {color, svg} = types[item.movementType] || {}

    return (
      <View style={cardStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SvgXml xml={svg} height={20} width={20} />
          <Text style={[styles.type, {color: color}]}>{item.movementType}</Text>
        </View>
        {/* <Text style={[styles.title, {color}]}>{item.product}</Text> */}
        {/* {row('Organization', item.organization)} */}
        {row('Locator', item.locater)}
        {row('Date', item.movementDate)}
        {row('Quantity', item.movementQuantity)}
        {row('Receipt', item.receipt ? 'Yes' : 'No')}
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <FlatList
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#2980b9',
                  padding: 0,
                  paddingVertical: 12,
                  margin: 0,
                  marginHorizontal: 0,
                  marginVertical: 0,
                },
              ]}
            >
              <Text
                style={[styles.availableInfo, {color: '#fff', fontSize: 20}]}
              >
                {records[0]?.organization}
              </Text>
            </View>
            <View style={[styles.row, {marginTop: 12}]}>
              <Text style={styles.available}>Product</Text>
              <Text style={[styles.availableInfo, {color: '#2980b9'}]}>
                {records[0]?.product}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={styles.available}>Available Units</Text>
              <Text style={[styles.availableInfo, {marginLeft: 15}]}>
                {availableUnits}
              </Text>
            </View>
            {loading ? <ActivityIndicator color={'black'} /> : null}
          </>
        }
        keyExtractor={(item, index) => item.movementDate + index} // Add a unique key
        data={records}
        renderItem={renderRecords}
      />
    </View>
  )
}

export default Result

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
  available: {fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#323232'},
  availableInfo: {color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: 20},
})
