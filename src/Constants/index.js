import axios from 'axios'
// import RNFetchBlob from 'rn-fetch-blob'
import {addKeyToStorage, getValueFromStorage} from '../helpers/asyncStorage'
// import {fetch} from 'react-native-ssl-pinning'

export const COLORS = {
  orange: '#FF5D22',
  teal: '#04608E',
}

export const username = 'SuperUser'
export const password = 'System'

export async function authenticateUser () {
  try {
    const protocol = await getValueFromStorage('protocol')
    const port = await getValueFromStorage('port')
    const host = await getValueFromStorage('host')
    const baseUrl = `${protocol}://${host}:${port}` // Replace with your actual base URL
    const requestBody = JSON.stringify({
      userName: 'SuperUser', // Replace with your username
      password: 'System', // Replace with your password
    })

    const response = await RNFetchBlob.config({
      trusty: true, // Disable SSL certificate verification (use with caution)
    }).fetch(
      'POST',
      `${baseUrl}/api/v1/auth/tokens`,
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      requestBody,
    )

    const data = response.json()
    console.log('data-->', data?.token)
    await updateToken(data?.token)

    // You can use 'data' for further processing or rendering in your React Native component
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export async function updateToken (authToken) {
  try {
    const protocol = await getValueFromStorage('protocol')
    const port = await getValueFromStorage('port')
    const host = await getValueFromStorage('host')
    const baseUrl = `${protocol}://${host}:${port}`
    const putUrl = `${baseUrl}/api/v1/auth/tokens`

    const requestBody = JSON.stringify({
      clientId: 1000000,
      roleId: 1000000,
      organizationId: 1000000,
      warehouseId: 1000000,
      language: 'en_US',
    })

    const response = await RNFetchBlob.config({
      trusty: true, // Disable SSL certificate verification (use with caution)
    }).fetch(
      'PUT',
      putUrl,
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      requestBody,
    )

    console.log('Authentication Token--->', response)
    const data = response.json()
    await addKeyToStorage('token', data?.token)
    // fetchDataById()

    // You can use 'data' for further processing or rendering in your React Native component
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export async function fetchDataByCode (id = 'EL-f9a1c2') {
  try {
    const getUrl = `https://count-assets.de.r.appspot.com/api/assetsByCode/${id}`
    const authToken = await getValueFromStorage('token')

    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Include your authorization header here
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('data-->', data)

    return data

    // You can use 'data' for further processing or rendering in your React Native component
  } catch (error) {
    console.error('An error occurred:', error)
    return error
  }
}

export async function fetchAssetHistory (id = '659c08957c9c59225c29d1cb') {
  try {
    const getUrl = `https://count-assets.de.r.appspot.com/api/transactions/${id}`
    const authToken = await getValueFromStorage('token')

    const response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Include your authorization header here
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('history of asset-->', data)

    return data

    // You can use 'data' for further processing or rendering in your React Native component
  } catch (error) {
    console.error('An error occurred:', error)
    return error
  }
}

export async function login (obj) {
  try {
    const baseUrl = `https://count-assets.de.r.appspot.com/api/login` // Replace with your actual base URL
    const requestBody = JSON.stringify(obj)

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: requestBody,
    })

    const data = await response.json()
    console.log('data-->', data)

    return data?.data
    // You can use 'data' for further processing or rendering in your React Native component
    // await updateToken(data?.token);
  } catch (error) {
    console.error('An error occurred:', error)
  }
}
