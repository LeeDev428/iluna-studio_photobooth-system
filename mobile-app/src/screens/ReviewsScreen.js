import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReviewsScreen({ route, navigation }) {
  const { user } = route.params || {};

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
            <Text style={styles.headerTitle}>Reviews in Studio</Text>
            <Text style={styles.headerSubtitle}>Customer Feedback & Testimonials</Text>
          </View>

          {/* Sample Reviews */}
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>Maria Santos</Text>
                <Text style={styles.reviewDate}>Jan 15, 2026</Text>
              </View>
              <View style={styles.starsContainer}>
                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.reviewText}>
                "Amazing service! The photobooth was a hit at our wedding. Professional setup and great photo quality. Highly recommended!"
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>John Reyes</Text>
                <Text style={styles.reviewDate}>Jan 10, 2026</Text>
              </View>
              <View style={styles.starsContainer}>
                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.reviewText}>
                "Perfect for our birthday party! Kids loved it and the props were fantastic. Will book again!"
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>Ana Cruz</Text>
                <Text style={styles.reviewDate}>Jan 5, 2026</Text>
              </View>
              <View style={styles.starsContainer}>
                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.reviewText}>
                "Excellent experience from booking to the actual event. Very professional and friendly staff!"
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>Mark Lopez</Text>
                <Text style={styles.reviewDate}>Dec 28, 2025</Text>
              </View>
              <View style={styles.starsContainer}>
                <Text style={styles.stars}>⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.reviewText}>
                "Great service and quality photos. Only minor delay in setup but overall very satisfied!"
              </Text>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
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
    marginBottom: 30,
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
  reviewsContainer: {
    paddingHorizontal: 20,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666666',
  },
  starsContainer: {
    marginBottom: 10,
  },
  stars: {
    fontSize: 16,
  },
  reviewText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  spacer: {
    height: 30,
  },
});
