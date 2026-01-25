import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function PaymentMethodScreen({ route, navigation }) {
  const { selectedDate, selectedDay, selectedTime, selectedDuration, user } = route.params;
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'gcash', name: 'Gcash', icon: 'G' },
    { id: 'paypal', name: 'PayPal', icon: 'P' },
    { id: 'bpi', name: 'BPI', icon: 'BPI' },
    { id: 'facebook', name: 'Iluna page on Fb', icon: 'f' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleConfirmBooking = async () => {
    if (!selectedPayment) {
      Alert.alert('No Payment Method', 'Please select a payment method.');
      return;
    }

    setLoading(true);

    try {
      // Format the booking data
      const bookingData = {
        user_id: user.id,
        booking_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        booking_day: selectedDay,
        booking_time: selectedTime,
        duration: selectedDuration,
        payment_method: selectedPayment,
        status: 'pending',
      };

      console.log('Booking data:', bookingData);

      // Send booking to backend
      const response = await api.post('/bookings/create.php', bookingData);

      console.log('Booking response:', response.data);

      if (response.data.success) {
        Alert.alert(
          'Booking Confirmed! 🎉',
          `Your booking has been confirmed!\n\nDate: ${selectedDate.toLocaleDateString()}\nDay: ${selectedDay}\nTime: ${selectedTime}\nDuration: ${selectedDuration}\nPayment: ${paymentMethods.find(p => p.id === selectedPayment)?.name}\n\nWe'll contact you soon for confirmation.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to dashboard
                navigation.navigate('Dashboard', { user });
              },
            },
          ]
        );
      } else {
        Alert.alert('Booking Failed', response.data.message || 'Unable to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create booking. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.headerTitle}>PAYMENT METHOD</Text>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentButton,
                  selectedPayment === method.id && styles.selectedPaymentButton,
                ]}
                onPress={() => setSelectedPayment(method.id)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentIconContainer}>
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                </View>
                <Text style={styles.paymentText}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactIcon}>✓</Text>
            <Text style={styles.contactText}>
              If you have other{'\n'}
              questions you can{'\n'}
              contact our page{'\n'}
              in Fb page
            </Text>
          </View>

          <View style={styles.phoneContainer}>
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.phoneText}>Number: 09239033779</Text>
          </View>

          {/* Booking Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <Text style={styles.summaryText}>Date: {selectedDate.toLocaleDateString()}</Text>
            <Text style={styles.summaryText}>Day: {selectedDay}</Text>
            <Text style={styles.summaryText}>Time: {selectedTime}</Text>
            <Text style={styles.summaryText}>Duration: {selectedDuration}</Text>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
            onPress={handleConfirmBooking}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>

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
    backgroundColor: 'rgba(20, 184, 166, 0.8)',
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
    letterSpacing: 2,
  },
  paymentContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedPaymentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: '#FFFFFF',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  paymentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
    marginBottom: 10,
  },
  contactIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryContainer: {
    marginHorizontal: 30,
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  confirmButton: {
    marginHorizontal: 30,
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#0D9488',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 40,
  },
});
