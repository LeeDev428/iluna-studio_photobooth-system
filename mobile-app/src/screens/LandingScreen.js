import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background with overlay */}
      <ImageBackground
        source={require('../../assets/landing-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(13, 148, 136, 0.85)', 'rgba(20, 184, 166, 0.75)']}
          style={styles.overlay}
        >
          {/* Time display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>9:00</Text>
          </View>

          {/* Bell icon container */}
          <View style={styles.bellContainer}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>

          {/* Main content */}
          <View style={styles.contentContainer}>
            {/* Logo/Brand text with "ILLUNA STUDIO" watermark effect */}
            <View style={styles.watermarkContainer}>
              <Text style={styles.watermarkText}>ILLUNA</Text>
              <Text style={styles.watermarkText}>STUDIO</Text>
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
      </ImageBackground>
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
  timeContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bellContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  bellIcon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    top: '25%',
    alignItems: 'center',
    opacity: 0.15,
  },
  watermarkText: {
    fontSize: 60,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
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
