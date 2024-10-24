/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ReporterScreen from './src/screens/ReporterScreen';
import { ROUTES_NAME } from './src/utlis/constants';
import DashboardScreen from './src/screens/DashboardScreen';
import RegisterScreen from './src/screens/RegisterScreen';
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0000CD',
    background: 'white',
    card: 'rgb(255, 255, 255)',
    text: 'darkblue',
    border: '#0000CD',
    disabled: '#D3D3D3',
    green:'#618264'
  },
};

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName={ROUTES_NAME.LOGIN.name} >
        <Stack.Screen name={ROUTES_NAME.LOGIN.name} component={LoginScreen}  options={{
          headerShown: false,
          gestureEnabled: false,
        }}/>
        <Stack.Screen name={ROUTES_NAME.REGISTER.name} component={RegisterScreen}  options={{
          headerShown: false,
          gestureEnabled: false,
        }}/>
        <Stack.Screen name={ROUTES_NAME.DASH.name} component={DashboardScreen}  options={{
          headerShown: true,
          gestureEnabled: false,
          headerLeft: ()=>(<View></View>)
        }}/>
          <Stack.Screen name={ROUTES_NAME.HOME.name} component={HomeScreen}  options={{
          headerShown: true,
          gestureEnabled: false,
          headerBackButtonMenuEnabled:true
        }}/>
          <Stack.Screen name={ROUTES_NAME.REPORTER.name} component={ReporterScreen}  options={{
          headerShown: true,
          gestureEnabled: false,
          headerBackButtonMenuEnabled:true,
          title:"Report Details"
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
