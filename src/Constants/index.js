import axios from 'axios'
import RNFetchBlob from 'rn-fetch-blob'
import {addKeyToStorage, getValueFromStorage} from '../helpers/asyncStorage'
// import {fetch} from 'react-native-ssl-pinning'

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

export async function fetchDataById (id = 1182061) {
  try {
    const protocol = await getValueFromStorage('protocol')
    const port = await getValueFromStorage('port')
    const host = await getValueFromStorage('host')
    const baseUrl = `${protocol}://${host}:${port}`
    const getUrl = `${baseUrl}/api/v1/models/m_transaction?$filter=M_AttributeSetInstance_ID eq ${id}`
    const authToken = await getValueFromStorage('token')
    const response = await RNFetchBlob.config({
      trusty: true, // Disable SSL certificate verification (use with caution)
    }).fetch('GET', getUrl, {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authToken}`,
    })

    const data = response.json()

    return data

    // You can use 'data' for further processing or rendering in your React Native component
  } catch (error) {
    console.error('An error occurred:', error)
    return error
  }
}
