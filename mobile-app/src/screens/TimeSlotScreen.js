import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TimeSlotScreen({ route, navigation }) {
  const { selectedDate, user, serviceType } = route.params;
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(null);

  // Get day of week from selected date
  const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT'][selectedDate.getDay()];

  // Duration based on service type with pricing
  const getDurationsWithPrices = () => {
    if (serviceType === 'wedding') {
      return [{ value: '8hr', label: '8 hours', price: '₱5,000' }];
    } else if (serviceType === 'photobooth' || serviceType === 'birthday') {
      return [
        { value: '20', label: '20 mins', price: '₱250' },
        { value: '30', label: '30 mins', price: '₱350' },
        { value: '1hr', label: '1 hour', price: '₱650' }
      ];
    } else if (serviceType === 'selfphoto') {
      return [
        { value: '30', label: '30 mins', price: '₱350' },
        { value: '1hr', label: '1 hour', price: '₱650' }
      ];
    }
    return [
      { value: '20', label: '20 mins', price: '₱250' },
      { value: '30', label: '30 mins', price: '₱350' },
      { value: '1hr', label: '1 hour', price: '₱650' }
    ];
  };

  const durationsWithPrices = getDurationsWithPrices();

  const incrementHour = () => {
    if (hour < 21) setHour(hour + 1);
  };

  const decrementHour = () => {
    if (hour > 9) setHour(hour - 1);
  };

  const incrementMinute = () => {
    setMinute((minute + 10) % 60);
  };

  const decrementMinute = () => {
    setMinute((minute - 10 + 60) % 60);
  };

  const formatTime = () => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleProceedToPayment = () => {
    if (!selectedDuration) {
      Alert.alert('Incomplete Selection', 'Please select duration.');
      return;
    }

    const selectedTime = formatTime();

    // Navigate to Payment Method screen
    navigation.navigate('PaymentMethod', {
      selectedDate,
      selectedDay: dayOfWeek,
      selectedTime,
      selectedDuration,
      serviceType,
      user,
    });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
          {/* Selected Date Display */}
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.dayText}>Day: {dayOfWeek}</Text>
          </View>

          {/* Custom Time Picker */}
          <View style={styles.timePickerSection}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timePickerContainer}>
              {/* Hour Picker */}
              <View style={styles.timePickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <View style={styles.pickerControls}>
                  <TouchableOpacity style={styles.pickerButton} onPress={incrementHour}>
                    <Text style={styles.pickerButtonText}>+</Text>
                  </TouchableOpacity>
                  <View style={styles.pickerValue}>
                    <Text style={styles.pickerValueText}>{hour.toString().padStart(2, '0')}</Text>
                  </View>
                  <TouchableOpacity style={styles.pickerButton} onPress={decrementHour}>
                    <Text style={styles.pickerButtonText}>−</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              {/* Minute Picker */}
              <View style={styles.timePickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <View style={styles.pickerControls}>
                  <TouchableOpacity style={styles.pickerButton} onPress={incrementMinute}>
                    <Text style={styles.pickerButtonText}>+</Text>
                  </TouchableOpacity>
                  <View style={styles.pickerValue}>
                    <Text style={styles.pickerValueText}>{minute.toString().padStart(2, '0')}</Text>
                  </View>
                  <TouchableOpacity style={styles.pickerButton} onPress={decrementMinute}>
                    <Text style={styles.pickerButtonText}>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Display Selected Time */}
            <View style={styles.selectedTimeDisplay}>
              <Text style={styles.selectedTimeText}>{formatTime()}</Text>
            </View>
          </View>

          {/* Duration Selection with Pricing */}
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Select Duration & Price</Text>
            <View style={styles.durationContainer}>
              {durationsWithPrices.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.durationButton,
                    selectedDuration === item.value && styles.selectedDurationButton,
                  ]}
                  onPress={() => setSelectedDuration(item.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.durationLabel,
                    selectedDuration === item.value && styles.selectedDurationLabel,
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={[
                    styles.durationPrice,
                    selectedDuration === item.value && styles.selectedDurationPrice,
                  ]}>
                    {item.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedToPayment}
            activeOpacity={0.8}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
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
  dateDisplay: {
    marginTop: 100,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  timePickerSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9488',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerColumn: {
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
    fontWeight: '600',
  },
  pickerControls: {
    alignItems: 'center',
  },
  pickerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  pickerButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pickerValue: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0D9488',
  },
  pickerValueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  timeSeparator: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0D9488',
    marginHorizontal: 15,
    marginTop: 35,
  },
  selectedTimeDisplay: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#0D9488',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  durationSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  durationButton: {
    width: '45%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedDurationButton: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  selectedDurationLabel: {
    color: '#FFFFFF',
  },
  durationPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9488',
  },
  selectedDurationPrice: {
    color: '#FFFFFF',
  },
  proceedButton: {
    marginHorizontal: 30,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  proceedButtonText: {
    color: '#0D9488',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 30,
  },
});
