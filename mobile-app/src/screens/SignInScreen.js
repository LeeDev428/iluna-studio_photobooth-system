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

export default function SignInScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    message: '',
    address: '',
    email: '',
    contact: '',
  });

  const handleSignIn = async () => {
    try {
      // Validate fields
      if (!formData.email || !formData.contact) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await api.post('/auth/signin.php', formData);
      
      if (response.data.success) {
        // Navigate to main app or show success
        alert('Sign in successful!');
      } else {
        alert(response.data.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
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
              <Text style={styles.headerTitle}>Sign In</Text>
              <Text style={styles.headerSubtitle}>Surname, First name, M.I.</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Message Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message"
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

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Click to Proceed</Text>
              </TouchableOpacity>

              {/* Register Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.registerLink}
              >
                <Text style={styles.registerText}>
                  Don't have an account? <Text style={styles.registerBold}>Register</Text>
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
    marginBottom: 40,
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
    marginBottom: 20,
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
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  registerBold: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
