import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useColorScheme } from 'react-native';
import {
  getNavigationTheme,
  getNativeStackScreenOptions,
} from '@/app/styles/theme';
import { useAppSelector } from '@/app/store';
import { CategoryTransactionsPage } from '@/pages/category-transactions';
import { CreateTransactionPage } from '@/pages/create-transaction';
import { EditCategoryPage } from '@/pages/edit-category';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { ManageCategoriesPage } from '@/pages/manage-categories';
import { SettingsPage } from '@/pages/settings';
import { TransactionsListPage } from '@/pages/transactions-list';
import { useTranslation } from '@/shared/i18n';

import { SettingsHeaderButton } from './SettingsHeaderButton';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const sessionEmail = useAppSelector((s) => s.session.email);
  const initialRouteName = sessionEmail ? 'Home' : 'Login';
  const { t } = useTranslation();

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
          name="Home"
          component={HomePage}
          options={{
            title: t('home.title'),
            headerRight: SettingsHeaderButton,
          }}
        />
        <Stack.Screen
          name="TransactionsList"
          component={TransactionsListPage}
          options={{
            title: t('transactions.title'),
            headerRight: SettingsHeaderButton,
          }}
        />
        <Stack.Screen
          name="CategoryTransactions"
          component={CategoryTransactionsPage}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="CreateTransaction"
          component={CreateTransactionPage}
          options={{
            title: t('create.titleNew'),
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          }}
        />
        <Stack.Screen
          name="EditCategory"
          component={EditCategoryPage}
          options={{
            title: t('category.editTitle'),
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          }}
        />
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesPage}
          options={{ title: t('category.manageTitle') }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsPage}
          options={{ title: t('settings.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
