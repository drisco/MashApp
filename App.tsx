import 'react-native-gesture-handler';
import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './ecrans/HomeScreen';
import SettingsScreen from './ecrans/SettingsScreen';
import UserListScreen from './ecrans/UserListScreen';
import WebPageScreen from './ecrans/WebPageScreen';
import HistoryScreen from './ecrans/HistoryScreen';
import AddScreen from './ecrans/AddScreen';
import LoginScreen from './ecrans/Login';
import RegisterScreen from './ecrans/Register';
import { UserProvider, UserContext } from './ecrans/config/StateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Liste des utilisateurs" component={UserListScreen} />
      <Stack.Screen 
        name="WebPage" 
        component={WebPageScreen}
        options={{
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 20 }}>
              <TouchableOpacity>
                <Ionicons name="fitness" size={25} color="black" />
              </TouchableOpacity>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity>
                  <Ionicons name="gift-outline" size={25} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen name="Historique" component={HistoryScreen} />
      <Stack.Screen name="Ajouter" component={AddScreen} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setIsLoggedIn(true);
      }
    };

    checkUserSession();
  }, []);

  return (
  <UserProvider>
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName = '';

              if (route.name === 'Home') {
                iconName = 'home-outline';
              } else if (route.name === 'Settings') {
                iconName = 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }}/>
          <Tab.Screen name="Settings" options={{ headerShown: false }}>
              {props => <SettingsScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Register" options={{ headerShown: false }}>
            {props => <RegisterScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  </UserProvider>
  );
}

export default App;
