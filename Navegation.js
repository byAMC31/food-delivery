import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Home from './screens/Home';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    backgroundColor: '#FA4A0C'
                },
            }}
        >
            <Stack.Screen name="Login" component={Login} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
}

export default function Navegation() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
