import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.background}>
        <LinearGradient
          colors={['#0D9488', '#14B8A6']}
          style={styles.overlay}
        >
          <View style={styles.contentContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo/illunaicon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Illuna Studio: Rental</Text>
              <Text style={styles.title}>Photobooth</Text>
              <Text style={styles.title}>with Easy Booking</Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('SignIn')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Tap to continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 155,
    height: 155,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 100,
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
