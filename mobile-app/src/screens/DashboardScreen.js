import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ route, navigation }) {
  const user = route.params?.user || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get calendar data for current month
  const getCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    
    const calendar = [];
    let day = 1;
    let nextMonthDay = 1;
    
    // Generate 6 weeks
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < startingDayOfWeek) {
          // Previous month days
          weekDays.push({
            day: prevMonthDays - startingDayOfWeek + dayOfWeek + 1,
            isCurrentMonth: false,
            isPrevMonth: true,
          });
        } else if (day > daysInMonth) {
          // Next month days
          weekDays.push({
            day: nextMonthDay++,
            isCurrentMonth: false,
            isNextMonth: true,
          });
        } else {
          // Current month days
          weekDays.push({
            day: day++,
            isCurrentMonth: true,
            date: new Date(year, month, day - 1),
          });
        }
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDatePress = (dateInfo) => {
    if (!dateInfo.isCurrentMonth) {
      Alert.alert('Invalid Selection', 'Please select a date from the current month.');
      return;
    }
    
    setSelectedDate(dateInfo.date);
    Alert.alert(
      'Date Selected',
      `You selected: ${dateInfo.date.toLocaleDateString()}\n\nThis will be used for booking.`,
      [
        { text: 'OK', onPress: () => console.log('Selected date:', dateInfo.date) }
      ]
    );
  };

  const handleLogout = () => {
    console.log('Logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            console.log('Logging out...');
            navigation.replace('Landing');
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  const isDateSelected = (dateInfo) => {
    if (!selectedDate || !dateInfo.date) return false;
    return selectedDate.toDateString() === dateInfo.date.toDateString();
  };

  const isSunday = (dayOfWeek) => dayOfWeek === 0;
  const isSaturday = (dayOfWeek) => dayOfWeek === 6;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendar = getCalendarData();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0D9488', '#14B8A6']}
        style={styles.gradient}
      >
        {/* Logout Button - Top Right */}
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>⏻</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Calendar Booking</Text>
            
            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                <Text style={styles.navButtonText}>{'<'}</Text>
              </TouchableOpacity>
              
              <Text style={styles.monthText}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <Text style={styles.navButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            {/* Week days header */}
            <View style={styles.weekDaysRow}>
              {weekDays.map((day, index) => (
                <View key={index} style={styles.weekDayCell}>
                  <Text style={[
                    styles.weekDayText,
                    isSunday(index) && styles.sundayText,
                    isSaturday(index) && styles.saturdayText,
                  ]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            {calendar.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((dateInfo, dayIndex) => {
                  const isSelected = isDateSelected(dateInfo);
                  const isWeekend = isSunday(dayIndex) || isSaturday(dayIndex);
                  
                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        !dateInfo.isCurrentMonth && styles.otherMonthDay,
                        isSelected && styles.selectedDay,
                      ]}
                      onPress={() => handleDatePress(dateInfo)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dayText,
                        !dateInfo.isCurrentMonth && styles.otherMonthDayText,
                        isWeekend && dateInfo.isCurrentMonth && styles.weekendText,
                        isSelected && styles.selectedDayText,
                      ]}>
                        {dateInfo.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Bottom Navigation Buttons */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>📝</Text>
              </View>
              <Text style={styles.navLabel}>Revie in Studio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>📅</Text>
              </View>
              <Text style={styles.navLabel}>Book Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>💬</Text>
              </View>
              <Text style={styles.navLabel}>Chat Box</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>
              Welcome, {user.name || 'User'}!
            </Text>
          </View>
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
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutIcon: {
    fontSize: 22,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  navButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  weekDaysRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#0D9488',
    paddingBottom: 8,
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sundayText: {
    color: '#DC2626',
  },
  saturdayText: {
    color: '#0D9488',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  otherMonthDay: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  selectedDay: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
    borderWidth: 2,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  otherMonthDayText: {
    color: '#9CA3AF',
  },
  weekendText: {
    color: '#DC2626',
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
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
  userInfo: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
});
