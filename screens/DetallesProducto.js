import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, doc, setDoc, updateDoc, addDoc, getDoc, getDocs, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appFirebase from '../firebase-config';

const DetallesProducto = ({ route, navigation }) => {
    const { producto } = route.params;
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
    const auth = getAuth(appFirebase)


    const aumentarCantidad = () => {
        if (cantidadSeleccionada < producto.existencia) {
            setCantidadSeleccionada(cantidadSeleccionada + 1);
        }
    };

    const disminuirCantidad = () => {
        if (cantidadSeleccionada > 1) {
            setCantidadSeleccionada(cantidadSeleccionada - 1);
        }
    };

    const agregarAlCarrito = async (producto) => {
        try {
            const auth = getAuth();
            const userId = auth.currentUser?.uid;
            const db = getFirestore();
            const carritoRef = collection(db, 'usuarios', userId, 'carrito');

            const productoCreado = {
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidadSeleccionada,
            };

            const carritoSnapshot = await getDocs(query(carritoRef));
            const productoExistente = carritoSnapshot.docs.find(doc => doc.data().nombre === producto.nombre);

            if (productoExistente) {
                const cantidadActual = productoExistente.data().cantidad;
                const cantidadNueva = cantidadActual + cantidadSeleccionada;
                await updateDoc(doc(carritoRef, productoExistente.id), { cantidad: cantidadNueva });
            } else {
                await addDoc(carritoRef, { ...productoCreado });
            }

            const productoRef = doc(db, "productos", producto.id);
            const productoSnapshot = await getDoc(productoRef);
            if (productoSnapshot.exists()) {
                const productoOriginal = productoSnapshot.data();
                const existenciaActualizada = productoOriginal.existencia - cantidadSeleccionada;
                if (existenciaActualizada >= 0) {
                    await updateDoc(productoRef, { existencia: existenciaActualizada });
                    Alert.alert('Producto añadido', '¡Producto agregado al carrito!');
                } else {
                    Alert.alert('Error', 'No hay suficiente existencia para agregar al carrito.');
                }
            } else {
                console.error('Error al agregar al carrito: No se encontró el producto.');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: producto.imagen }} style={styles.productImage} />
            <View style={styles.productDetailsContainer}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                <Text style={styles.productPrice}>Precio: ${producto.precio}</Text>
                <Text style={styles.productCategory}>Categoría: {producto.categoria}</Text>
                <Text style={styles.productExistence}>Existencia: {producto.existencia}</Text>
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={disminuirCantidad}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{cantidadSeleccionada}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={aumentarCantidad}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => agregarAlCarrito(producto)}>
                <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    productImage: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        marginBottom: 20,
    },
    productDetailsContainer: {
        marginBottom: 20,
        alignItems: 'center'
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FA4A0C',
        marginBottom: 5,
    },
    productCategory: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 5,
    },
    productExistence: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        width: '15%',
        borderRadius: 50,
    },
    quantityButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    quantity: {
        fontSize: 24,
        marginHorizontal: 20,
        fontWeight: 'bold',
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

export default DetallesProducto;
