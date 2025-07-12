// App.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './components/Home';
import TrashScreen from './components/Trash';

const Tab = createBottomTabNavigator();

const CircularIcon = ({ iconName, size, color }) => {
  return (
    <View
      style={{
        width: '95%',
        height: 50,
        borderRadius: 20,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        marginLeft: 4,
      }}
    >
      <MaterialIcons name={iconName} size={size} color={color} />
    </View>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hideSplash = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <NavigationContainer>
      {showSplash ? (
        <View style={styles.splashContainer}>
          <Image source={require('./assets/open.png')} style={styles.splashImage} />
        </View>
      ) : (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Trash') {
                iconName = 'delete';
              }

              return <CircularIcon iconName={iconName} size={size} color={color} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: {
              height: 60,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Trash" component={TrashScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
