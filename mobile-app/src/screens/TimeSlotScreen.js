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
  const { selectedDate, user } = route.params;
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT'];
  
  const timeSlots = [
    '9 10 AM', '10 11 AM', '11 12 NN', '12 1 PM', '1-2 PM',
    '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM', '7-8 PM', '8 PM'
  ];

  const durations = ['10', '20', '30', '1hr'];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleProceedToPayment = () => {
    if (!selectedDay || !selectedTime || !selectedDuration) {
      Alert.alert('Incomplete Selection', 'Please select day, time, and duration.');
      return;
    }

    // Navigate to Payment Method screen
    navigation.navigate('PaymentMethod', {
      selectedDate,
      selectedDay,
      selectedTime,
      selectedDuration,
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
        colors={['#4CAF50', '#2196F3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          </View>

          {/* Week Days Selection */}
          <View style={styles.sectionContainer}>
            <View style={styles.weekDaysGrid}>
              {weekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.weekDayButton,
                    selectedDay === day && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.weekDayButtonText,
                    selectedDay === day && styles.selectedButtonText,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Slots Grid */}
          <View style={styles.sectionContainer}>
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlotButton,
                    selectedTime === time && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedButtonText,
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Selection - Horizontal */}
          <View style={styles.durationContainer}>
            {durations.map((duration, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.selectedDurationButton,
                ]}
                onPress={() => setSelectedDuration(duration)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.durationText,
                  selectedDuration === duration && styles.selectedDurationText,
                ]}>
                  {duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Proceed Button */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedToPayment}
            activeOpacity={0.8}
          >
            <Text style={styles.proceedButtonText}>click for the payment method</Text>
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
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  weekDaysGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  weekDayButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  weekDayButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },
  timeSlotsGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlotButton: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  durationButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedDurationButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  proceedButton: {
    marginHorizontal: 30,
    marginTop: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    height: 30,
  },
});
