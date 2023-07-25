import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Credenciales from './screens/Credenciales';
import HomeAdmin from './screens/HomeAdmin';
import HomeCliente from './screens/HomeCliente';
import CrudProductos from './screens/CrudProductos';
import HomeRepartidor from './screens/HomeRepartidor';
import CrearProducto from './screens/CrearProducto';
import EditarProducto from './screens/EditarProducto';
import DetallesProducto from './screens/DetallesProducto';
import Carrito from './screens/Carrito';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    backgroundColor: '#FA4A0C',
                },
                headerTintColor: '#FFFFFF'
            }}
        >
            <Stack.Screen name="Credenciales" component={Credenciales} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
            <Stack.Screen name="CrudProductos" component={CrudProductos} />
            <Stack.Screen name="CrearProducto" component={CrearProducto} />
            <Stack.Screen name="EditarProducto" component={EditarProducto} />
            <Stack.Screen name="HomeCliente" component={HomeCliente} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="Carrito" component={Carrito} />
            <Stack.Screen name="DetallesProducto" component={DetallesProducto} />
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
