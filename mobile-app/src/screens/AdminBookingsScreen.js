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

export default function AdminBookingsScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all'); // all, pending, confirmed

  useEffect(() => {
    loadBookings();
  }, [selectedDate, filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      let url = `/admin/get_bookings.php?date=${dateStr}`;
      
      if (filter === 'pending') {
        url += '&status=pending';
      } else if (filter === 'confirmed') {
        url += '&status=confirmed';
      }

      const response = await api.get(url);
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
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

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
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

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#0D9488', '#14B8A6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>

        {/* Date Picker */}
        <View style={styles.datePicker}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => changeDate(-1)}>
            <Text style={styles.dateBtnText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            {!isToday() && (
              <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity style={styles.dateBtn} onPress={() => changeDate(1)}>
            <Text style={styles.dateBtnText}>→</Text>
          </TouchableOpacity>
        </View>

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
            style={[styles.filterTab, filter === 'pending' && styles.activeTab]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'confirmed' && styles.activeTab]}
            onPress={() => setFilter('confirmed')}
          >
            <Text style={[styles.filterText, filter === 'confirmed' && styles.activeFilterText]}>
              Confirmed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadBookings} />
          }
        >
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No bookings for this date</Text>
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

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.confirmBtn]}
                      onPress={() => updateBookingStatus(booking.id, 'confirmed')}
                    >
                      <Text style={styles.actionBtnText}>✓ Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <Text style={styles.actionBtnText}>✕ Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {booking.status === 'confirmed' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.completeBtn]}
                      onPress={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      <Text style={styles.actionBtnText}>✓ Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <Text style={styles.actionBtnText}>✕ Cancel</Text>
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
            <View style={[styles.iconContainer, styles.activeIcon]}>
              <Text style={styles.iconText}>📋</Text>
            </View>
            <Text style={[styles.navLabel, styles.activeLabel]}>Bookings</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 10,
  },
  dateBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  todayBtn: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  todayBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
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
    marginBottom: 15,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: '#10B981',
  },
  cancelBtn: {
    backgroundColor: '#EF4444',
  },
  completeBtn: {
    backgroundColor: '#3B82F6',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
