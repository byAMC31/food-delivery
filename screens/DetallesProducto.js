import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const DetallesProducto = ({ route }) => {
    const { producto } = route.params;
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

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

    const agregarAlCarrito = () => {
        // Aquí puedes implementar la lógica para agregar el producto al carrito
        // por ejemplo, guardar el producto y la cantidad seleccionada en el estado global o en algún servicio de carrito.
        // Por ahora, simplemente mostraremos un mensaje en la consola al presionar el botón "Agregar al carrito".
        console.log(`Agregado al carrito: ${producto.nombre}, cantidad: ${cantidadSeleccionada}`);
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
            <TouchableOpacity style={styles.addToCartButton} onPress={agregarAlCarrito}>
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
