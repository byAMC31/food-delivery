import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const HomeRepartidor = () => {
    const [pedidos, setPedidos] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const obtenerPedidos = async () => {
            const pedidosRef = collection(db, 'pedidos');
            const querySnapshot = await getDocs(pedidosRef);
            const pedidosData = querySnapshot.docs.map((doc) => doc.data());
            setPedidos(pedidosData);
        };

        obtenerPedidos();
    }, []);

    const calcularTotalCarrito = (carrito) => {
        let total = 0;
        carrito.forEach((productoCarrito) => {
            total += productoCarrito.precio * productoCarrito.cantidad;
        });
        return total;
    };

    const renderProductoCarrito = ({ item }) => {
        return (
            <View style={styles.productoCarrito}>
                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <Text style={styles.productoCantidad}>Cantidad: {item.cantidad}</Text>
                <Text style={styles.productoPrecio}>Total: ${item.precio * item.cantidad}</Text>
            </View>
        );
    };

    const renderPedido = ({ item }) => {
        return (
            <View style={styles.pedidoContainer}>
                <View style={styles.header}>
                    <Icon name="assignment" size={24} color="#555" />
                    <Text style={styles.userId}>Usuario ID</Text>
                </View>
                <FlatList
                    data={item.carrito}
                    keyExtractor={(productoCarrito, index) => `${productoCarrito.id}-${index}`}
                    renderItem={renderProductoCarrito}
                />
                <Text style={styles.precioTotal}>Total a pagar: ${calcularTotalCarrito(item.carrito)}</Text>
                <TouchableOpacity style={styles.verDetalleButton}>
                    <Text style={styles.verDetalleButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={pedidos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderPedido}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F2F2F2',
    },
    pedidoContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userId: {
        marginLeft: 10,
        fontSize: 14,
        color: '#555',
    },
    productoCarrito: {
        marginLeft: 10,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        paddingBottom: 10,
    },
    productoNombre: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productoCantidad: {
        fontSize: 14,
        color: '#555',
    },
    productoPrecio: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#FA4A0C',
    },
    precioTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        color: '#FA4A0C',
    },
    verDetalleButton: {
        backgroundColor: '#FA4A0C',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 10,
    },
    verDetalleButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeRepartidor;
