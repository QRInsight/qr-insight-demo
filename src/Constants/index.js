import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {addKeyToStorage, getValueFromStorage} from '../helpers/asyncStorage';
// import {fetch} from 'react-native-ssl-pinning'

export const COLORS = {
  bgGrey: '#F2F2F2',
  theme: '#02618E',
  bgBlue: '#DFF1FF',
  white: '#fff',
};

export const TxtWeight = {
  Bold: 'bold',
  Semi: '600',
  Light: '300',
  Medium: '500',
  Regular: '400',
};

export const TxtSize = {
  XXS: 8.5,
  XS: 10.5,
  SM: 13.5,
  MD: 15,
  LG: 18,
  XL: 24,
  XXL: 32,
};

export const Space = {
  XL: 30,
  LG: 20,
  MD: 15,
  SM: 10,
  XS: 5,
};

export const username = 'SuperUser';
export const password = 'System';

// Base URL Helper
const getBaseUrl = async () => {
  const protocol = await getValueFromStorage('protocol');
  const port = await getValueFromStorage('port');
  const host = await getValueFromStorage('host');
  return `${protocol}://${host}:${port}`;
};

// Token Helper
const getAuthToken = async () => {
  return await getValueFromStorage('token');
};

// Authenticate User
export async function authenticateUser(username, password) {
  const protocol = await getValueFromStorage('protocol');
  const port = await getValueFromStorage('port');
  const host = await getValueFromStorage('host');
  const baseUrl = `${port}://${host}:${protocol}`;
  console.log('baseUrl==>', baseUrl);

  const requestBody = JSON.stringify({
    userName: username,
    password: password,
  });

  const response = await RNFetchBlob.config({trusty: true}).fetch(
    'POST',
    `${baseUrl}/api/v1/auth/tokens`,
    {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    requestBody,
  );

  const data = await response.json();
  return data?.token; // Return the token
}

// Update Token
export async function updateToken(authToken) {
  const protocol = await getValueFromStorage('protocol');
  const port = await getValueFromStorage('port');
  const host = await getValueFromStorage('host');
  const baseUrl = `${port}://${host}:${protocol}`;

  const requestBody = JSON.stringify({
    clientId: 1000002,
    roleId: 1000016,
    organizationId: 1000020,
    warehouseId: 0,
    language: 'en_Us',
  });

  const response = await RNFetchBlob.config({trusty: true}).fetch(
    'PUT',
    `${baseUrl}/api/v1/auth/tokens`,
    {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    requestBody,
  );

  const data = await response.json();
  return data?.token; // Return the updated token
}

// Fetch Data by ID
export async function fetchDataById(id = 1182061) {
  try {
    const baseUrl = await getBaseUrl();
    const authToken = await getAuthToken();
    const getUrl = `${baseUrl}/api/v1/models/m_transaction?$filter=M_AttributeSetInstance_ID eq ${id}`;

    const response = await RNFetchBlob.config({
      trusty: true, // Disable SSL certificate verification (use with caution)
    }).fetch('GET', getUrl, {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const data = await response.json();
    console.log('Fetched Data:', data);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
}
