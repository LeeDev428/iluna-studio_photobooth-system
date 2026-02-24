import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const reviewImages = [
  require('../../assets/reviewsfeedback/626189517_1474192897476296_3835186082946722999_n.jpg'),
  require('../../assets/reviewsfeedback/634424155_1411900317060942_4068203125907541104_n.jpg'),
  require('../../assets/reviewsfeedback/634501357_970247145739485_6375934190656806004_n.jpg'),
  require('../../assets/reviewsfeedback/637123742_921913853704393_4526185762267702450_n.jpg'),
  require('../../assets/reviewsfeedback/637359781_911034628559938_5023765142784865481_n.jpg'),
  require('../../assets/reviewsfeedback/637476998_1527233239116777_8385022561307217792_n.jpg'),
  require('../../assets/reviewsfeedback/637847697_939427758603075_6524595929637001195_n.jpg'),
  require('../../assets/reviewsfeedback/638248028_1203498445199275_1203394239203341930_n.jpg'),
  require('../../assets/reviewsfeedback/638527543_905330022291743_3253484585737511956_n.jpg'),
  require('../../assets/reviewsfeedback/638817462_1337327634903926_8204627968799762890_n.jpg'),
  require('../../assets/reviewsfeedback/639037537_25958108213848578_7237704746897963668_n.jpg'),
  require('../../assets/reviewsfeedback/639604614_917397557317963_412981218796774523_n.jpg'),
  require('../../assets/reviewsfeedback/641890491_1952006969006773_5105992820770134419_n.jpg'),
];

export default function ReviewsScreen({ route, navigation }) {
  const { user } = route.params || {};
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#0D9488', '#14B8A6']}
        style={styles.gradient}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reviews & Feedback</Text>
            <Text style={styles.headerSubtitle}>What our customers say</Text>
          </View>

          {/* Image Grid */}
          <View style={styles.grid}>
            {reviewImages.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageWrapper}
                onPress={() => setSelectedImage(img)}
                activeOpacity={0.85}
              >
                <Image source={img} style={styles.reviewImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Fullscreen Image Modal */}
        <Modal
          visible={selectedImage !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedImage(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={selectedImage}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.5)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    marginTop: 100,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: (width - 30) / 2,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  reviewImage: {
    width: '100%',
    height: 200,
  },
  spacer: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullImage: {
    width: width,
    height: width * 1.2,
  },
});
