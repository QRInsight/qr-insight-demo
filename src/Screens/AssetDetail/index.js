import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import {addKeyToStorage, getValueFromStorage} from '../../helpers/asyncStorage';
import {useNavigation} from '@react-navigation/native';
import {COLORS, TxtWeight} from '../../Constants';
import {images} from '../../assets';
import Txt from '../../components/Txt';
import {Input} from '../../components/TxtInput';
import {Btn} from '../../components/Btn';
import Container from '../../components/Container';

const AssetDetail = () => {
  return <Container title='Asset Detail'></Container>;
};

export default AssetDetail;

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.bgBlue, flex: 1},
});
