import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import SignInScreen from './src/screens/SignInScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ServiceSelectionScreen from './src/screens/ServiceSelectionScreen';
import TimeSlotScreen from './src/screens/TimeSlotScreen';
import PaymentMethodScreen from './src/screens/PaymentMethodScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import ChatBoxScreen from './src/screens/ChatBoxScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminChatScreen from './src/screens/AdminChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
        <Stack.Screen name="TimeSlot" component={TimeSlotScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminChat" component={AdminChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
