/**
 * Verdant Rider - Delivery Partner App
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {DriverAuthProvider} from './src/context/DriverAuthContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <DriverAuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </DriverAuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
