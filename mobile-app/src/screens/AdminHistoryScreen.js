import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function AdminHistoryScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      let url = '/admin/get_bookings.php?history=true';
      
      if (filter === 'completed') {
        url += '&status=completed';
      } else if (filter === 'cancelled') {
        url += '&status=cancelled';
      }

      const response = await api.get(url);
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
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
    if (duration === '8hr') return '₱5,000';
    return '₱0';
  };

  const calculateTotalRevenue = () => {
    let total = 0;
    bookings.forEach(booking => {
      if (booking.status === 'completed') {
        const duration = booking.duration;
        if (duration === '20') total += 250;
        else if (duration === '30') total += 350;
        else if (duration === '1hr') total += 650;
        else if (duration === '8hr') total += 5000;
      }
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking History</Text>
          <Text style={styles.headerSubtitle}>Past bookings</Text>
        </View>

        {/* Revenue Display */}
        {filter === 'all' || filter === 'completed' ? (
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Total Revenue (Completed)</Text>
            <Text style={styles.revenueValue}>₱{calculateTotalRevenue().toLocaleString()}</Text>
          </View>
        ) : null}

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.activeTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.activeTab]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'cancelled' && styles.activeTab]}
            onPress={() => setFilter('cancelled')}
          >
            <Text style={[styles.filterText, filter === 'cancelled' && styles.activeFilterText]}>
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadHistory} />
          }
        >
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No past bookings</Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.customerName}>{booking.user_name}</Text>
                    <Text style={styles.customerContact}>📞 {booking.user_contact}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service:</Text>
                    <Text style={styles.detailValue}>{booking.service_type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{booking.booking_date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailValue}>{booking.booking_time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{booking.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={[styles.detailValue, styles.priceText]}>
                      {getPriceByDuration(booking.duration)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment:</Text>
                    <Text style={styles.detailValue}>{booking.payment_method}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('AdminHome', { user })}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🏠</Text>
            </View>
            <Text style={styles.navLabel}>Home</Text>
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
            <View style={[styles.iconContainer, styles.activeIcon]}>
              <Text style={styles.iconText}>📚</Text>
            </View>
            <Text style={[styles.navLabel, styles.activeLabel]}>History</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
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
  revenueCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#10B981',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 5,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeFilterText: {
    color: '#0D9488',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  customerContact: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardBody: {
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  priceText: {
    color: '#0D9488',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spacer: {
    height: 20,
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
