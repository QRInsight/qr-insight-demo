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

  useEffect(() => {
    // Fetch data for all dropdowns
    const fetchDropdownData = async () => {
      if (isDataFetched) return; // Avoid redundant fetches
      setLoading(true);

      try {
        const authToken = await getValueFromStorage('token');
        const protocol = await getValueFromStorage('protocol');
        const host = await getValueFromStorage('host');
        const port = await getValueFromStorage('port');
        const baseUrl = `${protocol}://${host}:${port}`;

        const responses = await Promise.all(
          apiEndpoints.map(endpoint =>
            RNFetchBlob.config({trusty: true})
              .fetch('GET', `${baseUrl}${endpoint.url}`, {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
              })
              .then(res => {
                const result = JSON.parse(res?.data);
                console.log("dropdown is working")

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
          ),
        );

        const dropdowns = responses.reduce(
          (acc, curr) => ({...acc, [curr.label]: curr.data}),
          {},
        );

        setDropdownData(dropdowns);
        setIsDataFetched(true);
      } catch (error) {
        console.log('Error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, [isDataFetched]);

  return (
    <DropdownContext.Provider value={{dropdownData, loading}}>
      {children}
    </DropdownContext.Provider>
  );
};
