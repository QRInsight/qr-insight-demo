import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  COLORS,
  TxtWeight,
  fetchProjects,
  fetchProjectLinesById,
} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import Container from '../../components/Container';

const AssetVerify = () => {
  const [assetNumber, setAssetNumber] = useState(''); // Input value for asset number
  const [projects, setProjects] = useState([]); // Projects list
  const [itemsByProject, setItemsByProject] = useState({}); // Items grouped by project
  const [loadingItems, setLoadingItems] = useState({}); // Loading state per project
  const [projectOpenState, setProjectOpenState] = useState({}); // Open/close state for each project
  const [loading, setLoading] = useState(false); // Global loading state
  const navigation = useNavigation();

  useEffect(() => {
    fetchAssetDetails();
  }, []);

  // Fetch Projects
  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjects();
      if (projectData?.length) {
        setProjects(projectData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Items By Project
  const fetchItemsByProject = async projectId => {
    try {
      setLoadingItems(prev => ({...prev, [projectId]: true}));

      // Fetch data for the selected project
      const itemsData = await fetchProjectLinesById(projectId);

      // Update state with items for the project
      setItemsByProject(prev => ({
        ...prev,
        [projectId]: itemsData,
      }));
    } catch (error) {
      console.error('Error fetching items for project:', error);
    } finally {
      setLoadingItems(prev => ({...prev, [projectId]: false}));
    }
  };

  // Handle Open/Close Toggle
  const toggleProjectState = projectId => {
    setProjectOpenState(prev => ({
      ...prev,
      [projectId]: !prev[projectId], // Toggle the open/close state
    }));

    // Fetch items only if the project is being opened
    if (!projectOpenState[projectId] && !itemsByProject[projectId]) {
      fetchItemsByProject(projectId);
    }
  };

  return (
    <Container onBack={() => navigation.goBack()} title="Asset Audit">
      {/* Input Field with Camera Button */}
      <View style={styles.inputView}>
        <Input
          placeholder="Asset Number"
          value={assetNumber}
          onChangeText={text => setAssetNumber(text)}
          containerSyle={styles.inputContainer}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={fetchAssetDetails}
          disabled={loading}>
          <Image source={images.camera} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      {projects.map(project => (
        <View key={project.id} style={{marginVertical: 10}}>
          {/* Project Header */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleProjectState(project.id)}
            style={[styles.projectButton, {flexDirection: 'row'}]}>
            <Txt center style={{flex: 1}}>
              {project?.C_Project_ID?.identifier || 'Project'}{' '}
            </Txt>
            <Txt>{projectOpenState[project.id] ? '▲' : '▼'}</Txt>
          </TouchableOpacity>

          {/* Items for Project */}
          {projectOpenState[project.id] && (
            <View>
              {loadingItems[project.id] ? (
                <ActivityIndicator size="small" color={COLORS.theme} />
              ) : (
                itemsByProject[project.id]?.map((item, index) => (
                  <View key={index} style={styles.itemCard}>
                    <Txt size={14} style={styles.itemText}>
                      Asset ID: {item?.A_Asset_ID?.id || 'N/A'}
                    </Txt>
                    <Txt size={14} style={styles.itemText}>
                      Identifier: {item?.A_Asset_ID?.identifier || 'N/A'}
                    </Txt>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      ))}

      {/* Footer Summary */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Txt>Total Assets</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Scanned</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Left</Txt>
          <Txt>800</Txt>
        </View>
        <View style={styles.footerItem}>
          <Txt>Report</Txt>
          <Txt>800</Txt>
        </View>
      </View>
    </Container>
  );
};

export default AssetVerify;

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 0,
  },
  cameraButton: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    height: 51,
    borderColor: COLORS.theme,
    backgroundColor: COLORS.bgBlue,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    height: 20,
    width: 20,
  },
  projectButton: {
    padding: 10,
    backgroundColor: COLORS.bgGrey,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.theme,
    marginVertical: 5,
  },
  itemCard: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderColor: COLORS.theme,
    borderRadius: 5,
  },
  itemText: {
    paddingVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.bgGrey,
  },
  footerItem: {
    alignItems: 'center',
  },
});
