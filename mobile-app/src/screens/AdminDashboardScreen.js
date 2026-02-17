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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function AdminDashboardScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('today'); // today, all, pending, confirmed

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      let url = '/admin/get_bookings.php';
      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        url += `?date=${today}`;
      } else if (filter === 'pending') {
        url += '?status=pending';
      } else if (filter === 'confirmed') {
        url += '?status=confirmed';
      }

      const response = await api.get(url);
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await api.post('/admin/update_booking_status.php', {
        booking_id: bookingId,
        status: status
      });

      if (response.data.success) {
        Alert.alert('Success', `Booking ${status} successfully`);
        loadBookings();
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking status');
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) navigation.replace('Landing');
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: () => navigation.replace('Landing'), style: 'destructive' }
        ]
      );
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getPriceByDuration = (duration) => {
    if (duration === '20') return '₱250';
    if (duration === '30') return '₱350';
    if (duration === '1hr') return '₱650';
    if (duration === '8hr') return '₱5000';
    return 'N/A';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>⏻</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'today' && styles.filterBtnActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'pending' && styles.filterBtnActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'confirmed' && styles.filterBtnActive]}
            onPress={() => setFilter('confirmed')}
          >
            <Text style={[styles.filterText, filter === 'confirmed' && styles.filterTextActive]}>
              Confirmed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadBookings} />}
        >
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.customerName}>👤 {booking.user_name}</Text>
                    <Text style={styles.customerContact}>📞 {booking.user_contact}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>📅 Date:</Text>
                  <Text style={styles.detailValue}>{booking.booking_date}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>🕐 Time:</Text>
                  <Text style={styles.detailValue}>{booking.booking_time}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>⏱️ Duration:</Text>
                  <Text style={styles.detailValue}>{booking.duration} mins</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>💰 Price:</Text>
                  <Text style={styles.detailValue}>{getPriceByDuration(booking.duration)}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>📸 Service:</Text>
                  <Text style={styles.detailValue}>{booking.service_type}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>💳 Payment:</Text>
                  <Text style={styles.detailValue}>{booking.payment_method}</Text>
                </View>

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => updateBookingStatus(booking.id, 'confirmed')}
                    >
                      <Text style={styles.actionBtnText}>✓ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                      onPress={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <Text style={styles.actionBtnText}>✕ Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {booking.status === 'confirmed' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]}
                      onPress={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      <Text style={styles.actionBtnText}>✓ Complete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminDashboard', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.navLabel}>Bookings</Text>
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
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#0D9488',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  bookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  customerContact: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  iconText: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});
