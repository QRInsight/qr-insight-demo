import React, {createContext, useState, useEffect} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {getValueFromStorage} from '../helpers/asyncStorage';

export const DropdownContext = createContext();

const apiEndpoints = [
  {
    label: 'To Employee',
    url: '/api/v1/models/ER_EMPLOYEE',
    fromLabel: 'From Employee',
    fromKey: 'ER_Employee_ID',
  },
  {
    label: 'To Department',
    url: '/api/v1/models/ER_DEPARTMENT',
    fromLabel: 'From Department',
    fromKey: 'ER_Department_ID',
  },
  {
    label: 'To Locator',
    url: '/api/v1/models/M_LOCATOR',
    fromLabel: 'From Locator',
    fromKey: 'M_Locator_ID',
  },
  {
    label: 'To Warehouse',
    url: '/api/v1/models/M_WAREHOUSE',
    fromLabel: 'From Warehouse',
    fromKey: 'M_Warehouse_ID',
  },
  {
    label: 'To Project',
    url: '/api/v1/models/C_PROJECT',
    fromLabel: 'From Project',
    fromKey: 'C_Project_ID',
  },
];

export const DropdownProvider = ({children}) => {
  const [dropdownData, setDropdownData] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDropdownData = async () => {
    setLoading(true);

    try {
      const authToken = await getValueFromStorage('token');
      const protocol = await getValueFromStorage('protocol');
      const host = await getValueFromStorage('host');
      const port = await getValueFromStorage('port');
      const baseUrl = `${protocol}://${host}:${port}`;

      const responses = await Promise.all(
        apiEndpoints.map(async endpoint => {
          // Check if data for this endpoint already exists
          if (dropdownData[endpoint.label]) {
            return {label: endpoint.label, data: dropdownData[endpoint.label]};
          }

          const res = await RNFetchBlob.config({trusty: true}).fetch(
            'GET',
            `${baseUrl}${endpoint.url}`,
            {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          );

          const result = JSON.parse(res?.data);

          return {
            label: endpoint.label,
            data: result?.records?.map(item => ({
              label:
                item.Name ||
                item.Designation ||
                item?.M_Warehouse_ID?.identifier,
              value: item.id || item.code,
            })),
          };
        }),
      );

      const dropdowns = responses.reduce(
        (acc, curr) => ({...acc, [curr.label]: curr.data}),
        {},
      );

      setDropdownData(prevData => ({...prevData, ...dropdowns}));
    } catch (error) {
      console.log('Error fetching dropdown data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger fetch if any dropdown data is missing
    const isDataMissing = apiEndpoints.some(
      endpoint => !dropdownData[endpoint.label],
    );

    if (isDataMissing) {
      fetchDropdownData();
    }
  }, [dropdownData]);

  return (
    <DropdownContext.Provider
      value={{dropdownData, fetchDropdownData, loading}}>
      {children}
    </DropdownContext.Provider>
  );
};
