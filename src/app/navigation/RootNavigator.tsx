import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useColorScheme } from 'react-native';
import {
  getNavigationTheme,
  getNativeStackScreenOptions,
} from '@/app/styles/theme';
import { useAppSelector } from '@/app/store';
import { CreateTransactionPage } from '@/pages/create-transaction';
import { LoginPage } from '@/pages/login';
import { TransactionsListPage } from '@/pages/transactions-list';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const sessionEmail = useAppSelector((s) => s.session.email);
  const initialRouteName = sessionEmail ? 'TransactionsList' : 'Login';

  return (
    <NavigationContainer theme={getNavigationTheme(isDark)}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={getNativeStackScreenOptions(isDark)}
      >
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TransactionsList"
          component={TransactionsListPage}
          options={{ title: 'Операции' }}
        />
        <Stack.Screen
          name="CreateTransaction"
          component={CreateTransactionPage}
          options={{
            title: 'Новая операция',
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
