import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, Space, TxtWeight, fetchHomeScreenData} from '../../Constants';
import Container from '../../components/Container';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {useNavigation} from '@react-navigation/native';

// Utility function to group projects by Name
const groupProjectsByName = projectsObj => {
  if (!projectsObj) return [];

  const groupedMap = {};

  Object.values(projectsObj).forEach(proj => {
    const {Name, Group, Qty} = proj;
    const quantity = parseInt(Qty, 10) || 0;

    if (!groupedMap[Name]) {
      groupedMap[Name] = {
        name: Name,
        totalQty: 0,
        groups: [], // each group entry => { group, qty }
      };
    }

    groupedMap[Name].totalQty += quantity;
    groupedMap[Name].groups.push({
      group: Group,
      qty: quantity,
    });
  });

  return Object.values(groupedMap);
};

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

// Category table remains the same
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
      {data &&
        data?.['Groups'] &&
        Object.entries(data?.['Groups']).map(([category, quantity], index) => {
          const cleanedCategory = category.startsWith('Fixed Assets - ')
            ? category.substring('Fixed Assets - '.length)
            : category;

          return (
            <View key={index} style={styles.tableRow}>
              <Txt style={[styles.tableCell, {flex: 2}]}>{cleanedCategory}</Txt>
              <Txt style={[styles.tableCell, {textAlign: 'center'}]}>
                {quantity}
              </Txt>
            </View>
          );
        })}
    </View>
  );
};

// Project table now uses grouped data
const AssetProjectTable = ({data, onRowPress}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeaderRow}>
        <Txt
          size={14}
          weight={TxtWeight.Regular}
          style={[styles.tableHeader, {flex: 2}]}>
          Project Name
        </Txt>
        <Txt size={14} weight={TxtWeight.Regular} style={styles.tableHeader}>
          Total Qty
        </Txt>
      </View>

      {data.map((project, index) => (
        <TouchableOpacity
          activeOpacity={0.9}
          key={index}
          style={styles.tableRow}
          onPress={() => onRowPress(project)}>
          <Txt style={[styles.tableCell, {flex: 2}]}>{project.name}</Txt>
          <Txt style={[styles.tableCell, {textAlign: 'center'}]}>
            {project.totalQty}
          </Txt>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const [assetsByCategory, setAssetsByCategory] = useState({});
  const [groupedProjects, setGroupedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const info = await fetchHomeScreenData();
    if (info.logs) {
      const parsed = JSON.parse(info.logs[0]);
      setAssetsByCategory(parsed);

      // Group the projects by Name and store them
      const grouped = groupProjectsByName(parsed.Projects);
      setGroupedProjects(grouped);
    }
  };

  // Count total assets from Groups
  const totalAssets =
    (assetsByCategory.Groups &&
      Object.values(assetsByCategory.Groups).reduce(
        (sum, quantity) => sum + parseInt(quantity, 10),
        0,
      )) ||
    0;

  // When a table row is tapped
  const handleRowPress = project => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  // Render the modal content for the selected project
  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <View style={styles.modalContent}>
        <Txt weight={TxtWeight.Bold} size={20} mb={15}>
          {selectedProject.name} - Detailed Groups
        </Txt>

        {selectedProject.groups.map((item, index) => {
          // Strip out the 'Fixed Assets - ' prefix if it exists
          const cleanedGroup = item.group.startsWith('Fixed Assets - ')
            ? item.group.substring('Fixed Assets - '.length)
            : item.group;

          return (
            <View key={index} style={styles.tableRow}>
              <Txt style={[styles.tableCell, {flex: 2}]}>{cleanedGroup}</Txt>
              <Txt style={[styles.tableCell, {textAlign: 'center'}]}>
                {item.qty}
              </Txt>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Container showBottom={false}>
      <View style={styles.cardRow}>
        <Card
          title="Asset Detail"
          onPress={() => navigation.navigate('AssetDetail')}
        />
        <Card
          title="Asset Report"
          onPress={() => navigation.navigate('AssetReports')}
          image={images.asset_report}
        />
      </View>
      <View style={styles.cardRow}>
        <Card
          title="Asset Transfer"
          onPress={() => navigation.navigate('AssetTransfer')}
          image={images.asset_transfer}
        />
        <Card
          title="Asset Audit"
          onPress={() => navigation.navigate('AssetVerify')}
          image={images.asset_audit}
        />
      </View>

      <View style={styles.totalView}>
        <Txt color={COLORS.white} size={20} center>
          Total Assets |{'  '}
          <Txt weight={TxtWeight.Bold} color={COLORS.white} size={25}>
            {totalAssets}
          </Txt>
        </Txt>
      </View>

      <Txt weight={TxtWeight.Semi} center size={18} mb={15} mt={10}>
        Asset Categories
      </Txt>
      <AssetCategoryTable title="Asset Categories" data={assetsByCategory} />

      <View style={styles.totalView}>
        <Txt color={COLORS.white} size={20} center>
          Total Projects |{'  '}
          <Txt weight={TxtWeight.Bold} color={COLORS.white} size={25}>
            {groupedProjects.length} {/* Distinct projects by Name */}
          </Txt>
        </Txt>
      </View>

      {/* Render the grouped projects */}
      <AssetProjectTable data={groupedProjects} onRowPress={handleRowPress} />

      {/* Bottom Modal for Project Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <ScrollView>{renderProjectDetails()}</ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Txt style={{color: COLORS.white}}>Close</Txt>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    shadowOffset: {width: 1, height: 1},
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
    paddingHorizontal: Space.MD,
    paddingBottom: Space.MD,
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
    textAlignVertical: 'center',
    padding: 4,
    paddingVertical: 8,
  },
  totalView: {
    paddingHorizontal: Space.XL,
    backgroundColor: COLORS.theme,
    paddingVertical: 7,
    borderRadius: 6,
    marginVertical: 15,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    maxHeight: '60%',
  },
  modalContent: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: COLORS.theme,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
