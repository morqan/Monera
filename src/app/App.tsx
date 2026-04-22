/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLockGate } from '@/features/app-lock';

import { getAppColors } from './styles/theme';
import { AppProviders } from './providers';
import { RootNavigator } from './navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = getAppColors(isDarkMode);

  return (
    <AppProviders>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View
          style={[styles.root, { backgroundColor: colors.groupedBackground }]}
        >
          <AppLockGate>
            <RootNavigator />
          </AppLockGate>
        </View>
      </SafeAreaProvider>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
