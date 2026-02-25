import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CustomerHomeScreen({ route, navigation }) {
  const user = route.params?.user || {};

  return (
    <LinearGradient
      colors={['#0D9488', '#14B8A6', '#0F766E']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D9488" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo/illunaicon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandName}>Illuna Studio</Text>
        <Text style={styles.welcomeText}>
          Welcome, {user.name || user.username || 'Guest'} 👋
        </Text>
        <Text style={styles.subText}>What would you like to do today?</Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menuContainer}>

        {/* Calendar Booking */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Dashboard', { user })}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>📅</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Calendar Booking</Text>
            <Text style={styles.cardDesc}>Pick a date and book your photobooth session</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Chat Us */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('ChatBox', { user })}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>💬</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Chat Us</Text>
            <Text style={styles.cardDesc}>Send us a message or ask a question</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Reviews & Feedback */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Reviews', { user })}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>⭐</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Reviews & Feedback</Text>
            <Text style={styles.cardDesc}>See what our customers are saying</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

      </View>

      {/* Footer sign out link */}
      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={() => navigation.replace('Landing')}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  // ── Header ──────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 95,
    height: 95,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginTop: 6,
  },
  subText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

  // ── Menu Cards ───────────────────────────────
  menuContainer: {
    width: width - 32,
    gap: 14,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 26,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  arrow: {
    fontSize: 28,
    color: '#14B8A6',
    fontWeight: '300',
    marginLeft: 8,
  },

  // ── Sign Out ─────────────────────────────────
  signOutBtn: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  signOutText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
