import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, getDocs, doc, deleteDoc, updateDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import appFirebase from '../firebase-config';

const Carrito = ({ navigation }) => {
    const [carrito, setCarrito] = useState([]);
    const auth = getAuth(appFirebase);
    const userId = auth.currentUser?.uid;
    const db = getFirestore();

    const obtenerProductosCarrito = async () => {
        try {
            const carritoRef = collection(db, 'usuarios', userId, 'carrito');
            const carritoSnapshot = await getDocs(query(carritoRef));
            const productos = carritoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const productosValidos = productos.filter(item => item.nombre && item.precio && item.cantidad && !isNaN(item.precio) && !isNaN(item.cantidad));

            setCarrito(productosValidos);
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
        }
    };

    useEffect(() => {
        obtenerProductosCarrito();
    }, []);

    const eliminarProducto = async (productoId) => {
        try {
            const productoEliminado = carrito.find((item) => item.id === productoId);
            if (!productoEliminado) {
                return;
            }

            const carritoActualizado = carrito.filter((item) => item.id !== productoId);
            setCarrito(carritoActualizado);

            const { nombre, cantidad } = productoEliminado;

            const productosRef = collection(db, 'productos');
            const querySnapshot = await getDocs(query(productosRef, where('nombre', '==', nombre)));
            if (querySnapshot.empty) {
                console.error('Error: El producto no se encontró en la colección de Productos');
                return;
            }

            const productoDoc = querySnapshot.docs[0];
            const productoExistente = productoDoc.data();
            const nuevaExistencia = productoExistente.existencia + cantidad;
            await updateDoc(doc(db, 'productos', productoDoc.id), { existencia: nuevaExistencia });

            const carritoRef = doc(db, 'usuarios', userId, 'carrito', productoId);
            await deleteDoc(carritoRef);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const confirmarEliminarProducto = (producto) => {
        Alert.alert(
            'Eliminar producto',
            `¿Estás seguro de que deseas eliminar ${producto.nombre} del carrito?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => eliminarProducto(producto.id),
                },
            ]
        );
    };

    const renderProductoItem = ({ item }) => {
        if (!item.nombre || !item.precio) {
            return null;
        }

        return (
            <TouchableOpacity style={styles.productCard} onPress={() => confirmarEliminarProducto(item)}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productPrice}>Precio: ${item.precio}</Text>
                <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
            </TouchableOpacity>
        );
    };

    const calcularPrecioTotal = () => {
        let total = 0;
        carrito.forEach((item) => {
            if (item.precio && item.cantidad && !isNaN(item.precio) && !isNaN(item.cantidad)) {
                total += item.precio * item.cantidad;
            }
        });
        return total;
    };

    const handlePagarPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {carrito.length === 0 ? (
                <Text style={styles.emptyCartText}>El carrito está vacío.</Text>
            ) : (
                <>
                    <FlatList
                        data={carrito}
                        keyExtractor={(item) => item.id}
                        renderItem={renderProductoItem}
                    />
                    <Text style={styles.totalPrice}>Total a pagar: ${calcularPrecioTotal()}</Text>
                    <TouchableOpacity style={styles.addToCartButton} onPress={handlePagarPress}>
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
