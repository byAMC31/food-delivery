import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { getFirestore, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appFirebase from '../firebase-config';

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const auth = getAuth(appFirebase);
    const userId = auth.currentUser?.uid;
    const db = getFirestore();

    const obtenerProductosCarrito = async () => {
        try {
            const carritoRef = collection(db, 'usuarios', userId, 'carrito');

            const carritoSnapshot = await getDocs(query(carritoRef));

            const productos = carritoSnapshot.docs.map(doc => doc.data());

            setCarrito(productos);
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
        }
    };

    useEffect(() => {
        obtenerProductosCarrito();
    }, []);

    const renderProductoItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard}>
            <Text style={styles.productName}>{item.nombre}</Text>
            <Text style={styles.productPrice}>Precio: ${item.precio}</Text>
            <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
        </TouchableOpacity>
    );

    const calcularPrecioTotal = () => {
        let total = 0;
        carrito.forEach((item) => {
            total += item.precio * item.cantidad;
        });
        return total;
    };

    return (
        <View style={styles.container}>
            {carrito.length === 0 ? (
                <Text style={styles.emptyCartText}>El carrito está vacío.</Text>
            ) : (
                <>
                    <FlatList
                        data={carrito}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderProductoItem}
                    />
                    <Text style={styles.totalPrice}>Total a pagar: ${calcularPrecioTotal()}</Text>
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => console.log('Evento de pago')}>
                        <Text style={styles.addToCartButtonText}>Pagar</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyCartText: {
        fontSize: 18,
        textAlign: 'center',
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
    },
    productName: {
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#FA4A0C',
    },
    productQuantity: {
        fontSize: 16,
        color: 'gray',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addToCartButton: {
        backgroundColor: "#FA4A0C",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Carrito;
