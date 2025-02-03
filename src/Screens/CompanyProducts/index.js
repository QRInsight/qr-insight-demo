import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Txt from '../../components/Txt';
import {COLORS, TxtWeight} from '../../Constants';

const {width} = Dimensions.get('window');

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        'https://pos-api-dot-ancient-episode-256312.de.r.appspot.com/api/v1/company?limit=10&page=1',
      );
      if (!response.data.error) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchBrands = async companyId => {
    try {
      const response = await axios.get(
        `https://pos-api-dot-ancient-episode-256312.de.r.appspot.com/api/v1/brand?limit=10&page=1&company=${companyId}`,
      );
      if (!response.data.error) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async brandId => {
    try {
      const response = await axios.get(
        `https://pos-api-dot-ancient-episode-256312.de.r.appspot.com/api/v1/product?limit=10&page=1&brand=${brandId}`,
      );
      if (!response.data.error) {
        setProducts(response.data.data.docs);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCompanyPress = company => {
    setSelectedCompany(company._id);
    fetchBrands(company._id);
  };

  const handleBrandPress = brand => {
    setSelectedBrand(brand._id);
    fetchProducts(brand._id);
  };

  const renderHeader = () => (
    <View>
      <Txt weight={TxtWeight.Semi} mt={20} style={styles.heading}>
        Companies
      </Txt>
      <View style={styles.flatListContainer}>
        <FlatList
          data={companies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.card,
                selectedCompany === item._id && styles.selectedCard,
              ]}
              onPress={() => handleCompanyPress(item)}>
              <Image
                source={{uri: item.companyLogo}}
                style={styles.companyImage}
                resizeMode="contain"
              />
              <Txt numberOfLines={1} style={styles.text}>
                {item.name}
              </Txt>
            </TouchableOpacity>
          )}
        />
      </View>

      {brands.length > 0 ? (
        <>
          <Txt weight={TxtWeight.Semi} mt={20} style={styles.heading}>
            Brands
          </Txt>
          <View style={styles.flatListContainer}>
            <FlatList
              data={brands}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.card,
                    selectedBrand === item._id && styles.selectedCard,
                  ]}
                  onPress={() => handleBrandPress(item)}>
                  <Image
                    source={{uri: item.brandLogo}}
                    style={styles.brandImage}
                    resizeMode="contain"
                  />
                  <Txt style={styles.text}>{item.name}</Txt>
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      ) : (
        selectedCompany && (
          <Txt weight={TxtWeight.Regular} style={styles.message}>
            No brands available for this company.
          </Txt>
        )
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.productColumnWrapper}
        ListHeaderComponent={renderHeader}
        renderItem={({item}) => (
          <View style={styles.productCard}>
            <Image
              source={{uri: item.image}}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Txt style={styles.productName}>{item.name}</Txt>
            <Txt style={styles.productPrice}>
              Rs. <Txt weight={TxtWeight.Bold}>{item.salesPrice}</Txt>
            </Txt>
          </View>
        )}
      />
      {selectedBrand && products.length === 0 && (
        <Txt weight={TxtWeight.Regular} style={styles.message}>
          No products available for this brand.
        </Txt>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    marginVertical: 10,
  },
  flatListContainer: {
    height: 80,
  },
  card: {
    marginRight: 10,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: COLORS.theme,
    borderWidth: 2,
  },
  companyImage: {
    width: 40,
    height: 40,
  },
  brandImage: {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 120,
  },
  message: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  productColumnWrapper: {
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  productCard: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.bgGrey,
    borderRadius: 8,
    padding: 12,
  },
  productImage: {
    height: 150,
    width: 120,
    alignSelf: 'center',
  },
  productName: {
    fontSize: 14,
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    marginTop: 5,
  },
});
