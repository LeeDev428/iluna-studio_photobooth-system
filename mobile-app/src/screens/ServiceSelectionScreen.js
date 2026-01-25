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

export default function ServiceSelectionScreen({ route, navigation }) {
  const { selectedDate, user } = route.params;

  const services = [
    { id: 'photobooth', name: 'PHOTOBOOTH BOOKING' },
    { id: 'selfphoto', name: 'SELF PHOTO BOOKING' },
    { id: 'birthday', name: 'BIRTHDAY BOOKING' },
    { id: 'wedding', name: 'WEDDING BOOKING' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleServiceSelect = (serviceType) => {
    // Navigate to TimeSlot screen with service type
    navigation.navigate('TimeSlot', {
      selectedDate,
      user,
      serviceType,
    });
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

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Service Options */}
          <View style={styles.servicesContainer}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceButton}
                onPress={() => handleServiceSelect(service.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  servicesContainer: {
    paddingHorizontal: 30,
    gap: 20,
  },
  serviceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    paddingVertical: 22,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
