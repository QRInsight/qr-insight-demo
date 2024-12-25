import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {COLORS, Space, TxtWeight} from '../../Constants';
import Container from '../../components/Container';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {useNavigation} from '@react-navigation/native';

const Card = ({
  title = 'Asset Detail',
  onPress,
  image = images.asset_detail,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.cardContainer}>
      <View style={styles.cardIconWrapper}>
        <Image source={image} style={styles.cardIcon} />
      </View>
      <Txt>{title}</Txt>
    </TouchableOpacity>
  );
};

const AssetCategoryTable = ({data}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeaderRow}>
        <Txt
          size={14}
          weight={TxtWeight.Regular}
          style={[styles.tableHeader, {flex: 2}]}>
          Asset Categories
        </Txt>
        <Txt size={14} weight={TxtWeight.Regular} style={styles.tableHeader}>
          Total Asset Quantity
        </Txt>
      </View>
      {data.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Txt style={[styles.tableCell, {flex: 2}]}>{item.category}</Txt>
          <Txt style={styles.tableCell}>{item.quantity}</Txt>
        </View>
      ))}
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const assetData = [
    {category: 'A', quantity: 30},
    {category: 'B', quantity: 20},
    {category: 'C', quantity: 40},
    {category: 'D', quantity: 90},
    {category: 'E', quantity: 10},
    {category: 'F', quantity: 60},
  ];

  const locations = [
    {
      name: 'Sarai',
      assetCategories: [
        {category: 'A', quantity: 30},
        {category: 'B', quantity: 20},
        {category: 'C', quantity: 40},
        {category: 'D', quantity: 90},
      ],
    },
    {
      name: 'Mandi',
      assetCategories: [],
    },
    {
      name: 'Gujjar Khan',
      assetCategories: [],
    },
    {
      name: 'Lahore',
      assetCategories: [],
    },
    {
      name: 'NMC Lahore',
      assetCategories: [],
    },
  ];

  return (
    <Container 
    showBottom={false}>
      <View style={styles.cardRow}>
        <Card
          title="Asset Detail"
          onPress={() => navigation.navigate('AssetDetail')}
        />
        <Card title="Asset Report" image={images.asset_report} />
      </View>
      <View style={styles.cardRow}>
        <Card title="Asset Transfer" image={images.asset_transfer} />
        <Card title="Asset Audit" image={images.asset_audit} />
      </View>

      <View style={styles.totalView}>
        <Txt color={COLORS.white} size={20} center>
          Total Assets |{'  '}
          <Txt weight={TxtWeight.Bold} color={COLORS.white} size={25}>
            800
          </Txt>
        </Txt>
      </View>

      <Txt weight={TxtWeight.Semi} center size={18} mb={15} mt={10}>
        Asset Categories
      </Txt>

      <AssetCategoryTable title="Asset Categories" data={assetData} />

      <View style={styles.totalView}>
        <Txt color={COLORS.white} size={20} center>
          Total Project |{'  '}
          <Txt weight={TxtWeight.Bold} color={COLORS.white} size={25}>
            5
          </Txt>
        </Txt>
      </View>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  cardContainer: {
    height: Dimensions.get('screen').width / 3,
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardIconWrapper: {
    height: 50,
    width: 50,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgBlue,
  },
  cardIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  cardRow: {
    flexDirection: 'row',
    padding: 1,
    gap: 15,
  },
  tableContainer: {
    backgroundColor: COLORS.bgGrey,
    padding: 10,
    paddingHorizontal: Space.XL,
    paddingBottom: Space.XL,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableHeader: {
    flex: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    gap: 10,
  },
  tableCell: {
    fontSize: 14,
    backgroundColor: COLORS.white,
    flex: 1,
    borderRadius: 6,
    textAlign: 'center',
    paddingVertical: 4,
  },
  totalView: {
    paddingHorizontal: Space.XL,
    backgroundColor: COLORS.theme,
    paddingVertical: 7,
    borderRadius: 6,
    marginVertical: 15,
  },
});
