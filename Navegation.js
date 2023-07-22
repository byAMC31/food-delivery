import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeAdmin from './screens/HomeAdmin';
import Credenciales from './screens/Credenciales';
import HomeCliente from './screens/HomeCliente';
import HomeRepartidor from './screens/HomeRepartidor';

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
            <Stack.Screen name="Credenciales" component={Credenciales} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
            <Stack.Screen name="HomeCliente" component={HomeCliente} />
            <Stack.Screen name="HomeRepartidor" component={HomeRepartidor} />
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
