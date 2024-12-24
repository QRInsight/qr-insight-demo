import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {COLORS, Space, TxtWeight} from '../Constants';
import {images} from '../assets';
import Txt from '../components/Txt';

const Container = ({title = 'Home', showBottom = true, children}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Image style={styles.headerIcon} source={images.backIcon} />
        </TouchableOpacity>

        <Txt
          center
          style={styles.headerTitle}
          mt={8}
          size={25}
          weight={TxtWeight.Bold}>
          {title}
        </Txt>

        <TouchableOpacity style={styles.headerButton}></TouchableOpacity>
      </View>

      <ImageBackground
        source={images.whiteBG}
        resizeMode="stretch"
        style={styles.backgroundImage}>
        <ScrollView style={{paddingHorizontal: Space.LG, marginTop: 100}}>
          {children}
        </ScrollView>
        {showBottom && (
          <View>
            <View style={styles.bottomCircleWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.bottomCircleButton}>
                <Image
                  source={images.home_icon}
                  style={styles.bottomCircleIcon}
                />
              </TouchableOpacity>
            </View>

            <ImageBackground
              source={images.bottom_bg}
              resizeMode="stretch"
              style={styles.bottomImageBackground}></ImageBackground>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.bgBlue, flex: 1},
  header: {
    height: 60,
    flexDirection: 'row',
    zIndex: 12,
    alignItems: 'center',
  },
  headerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  headerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    position: 'absolute',
    height: '100%',
  },
  bottomCircleWrapper: {
    backgroundColor: COLORS.white,
    height: 55,
    width: 60,
    zIndex: 12,
    marginBottom: -14,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomCircleButton: {
    backgroundColor: COLORS.theme,
    height: 45,
    width: 45,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCircleIcon: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
  },
  bottomImageBackground: {
    height: 40,
  },
});
