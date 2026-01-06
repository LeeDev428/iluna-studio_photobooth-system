import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleInitial: '',
    message: '',
    address: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    try {
      // Validate fields
      if (!formData.surname || !formData.firstName || !formData.email || !formData.contact || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const response = await api.post('/auth/register.php', formData);
      
      if (response.data.success) {
        alert('Registration successful! Please sign in.');
        navigation.navigate('SignIn');
      } else {
        alert(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0D9488', '#14B8A6', '#0D9488']}
        style={styles.gradient}
      >
        {/* Time display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>9:00</Text>
        </View>

        {/* Bell icon */}
        <View style={styles.bellContainer}>
          <Text style={styles.bellIcon}>🔔</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Register</Text>
              <Text style={styles.headerSubtitle}>Create your account</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Name Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Surname</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Surname"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={formData.surname}
                  onChangeText={(text) => setFormData({...formData, surname: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({...formData, firstName: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Middle Initial</Text>
                <TextInput
                  style={styles.input}
                  placeholder="M.I."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  maxLength={2}
                  value={formData.middleInitial}
                  onChangeText={(text) => setFormData({...formData, middleInitial: text})}
                />
              </View>

              {/* Message Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message (optional)"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={formData.message}
                  onChangeText={(text) => setFormData({...formData, message: text})}
                />
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Personal Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>

              {/* Contact Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telephone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contact"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="phone-pad"
                  value={formData.contact}
                  onChangeText={(text) => setFormData({...formData, contact: text})}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                />
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Click to Register</Text>
              </TouchableOpacity>

              {/* Sign In Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={styles.signInLink}
              >
                <Text style={styles.signInText}>
                  Already have an account? <Text style={styles.signInBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
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
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  signInBold: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
