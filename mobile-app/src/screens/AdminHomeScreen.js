import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function AdminHomeScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/get_dashboard_stats.php');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Landing'), style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Admin Panel</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadDashboardStats} />
          }
        >
          {/* Stats Cards */}
          {stats && (
            <>
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.statValue}>₱{stats.total_sales.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Sales</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.statValue}>₱{stats.monthly_sales.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>This Month</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.statValue}>{stats.total_bookings}</Text>
                  <Text style={styles.statLabel}>Total Bookings</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.statValue}>{stats.today_bookings}</Text>
                  <Text style={styles.statLabel}>Today</Text>
                </View>
              </View>

              {/* Recent Bookings */}
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent Bookings</Text>
                {stats.recent_bookings.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No bookings yet</Text>
                  </View>
                ) : (
                  stats.recent_bookings.map((booking) => (
                    <View key={booking.id} style={styles.bookingCard}>
                      <View style={styles.bookingHeader}>
                        <Text style={styles.bookingName}>{booking.user_name}</Text>
                      </View>
                      <Text style={styles.bookingDetail}>📅 {booking.booking_date}</Text>
                      <Text style={styles.bookingDetail}>🕐 {booking.booking_time}</Text>
                      <Text style={styles.bookingDetail}>📷 {booking.service_type}</Text>
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminHome', { user })}
          >
            <View style={[styles.iconContainer, styles.activeIcon]}>
              <Text style={styles.iconText}>🏠</Text>
            </View>
            <Text style={[styles.navLabel, styles.activeLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminBookings', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📋</Text>
            </View>
            <Text style={styles.navLabel}>Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminHistory', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📚</Text>
            </View>
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminChat', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  bookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bookingDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeIcon: {
    backgroundColor: '#FFFFFF',
  },
  iconText: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
