import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { FAB } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeCliente = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const db = getFirestore();

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const productosRef = collection(db, 'productos');
                let q = query(productosRef);

                if (categoriaSeleccionada !== 'Todos') {
                    q = query(productosRef, where('categoria', '==', categoriaSeleccionada));
                }

                const querySnapshot = await getDocs(q);

                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                setProductos(data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        obtenerProductos();

        return () => { };
    }, [categoriaSeleccionada]);

    const renderProductCard = (item) => (
        <TouchableOpacity onPress={() => navigateToDetallesProducto(item)}>
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <Image source={{ uri: item.imagen }} style={styles.productImage} />
                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{item.nombre}</Text>
                        <Text style={styles.productPrice}>Precio: ${item.precio}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    const navigateToDetallesProducto = (item) => {
        navigation.navigate('DetallesProducto', { producto: item });
    };

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.cabecera}>
                    <Image source={require("../assets/logo.png")} style={styles.logo} />
                    <View style={styles.contenedorCategorias}>
                        <TouchableOpacity
                            style={[
                                styles.categoriaBoton,
                                categoriaSeleccionada.toLowerCase() === 'todos' && styles.categoriaBotonSeleccionada,
                            ]}
                            onPress={() => setCategoriaSeleccionada('Todos')}
                        >
                            <Text style={[styles.textoBotonOpcion, categoriaSeleccionada.toLowerCase() === 'todos' && styles.textoBotonOpcionSeleccionada]}>Todos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.categoriaBoton,
                                categoriaSeleccionada.toLowerCase() === 'panadería' && styles.categoriaBotonSeleccionada,
                            ]}
                            onPress={() => setCategoriaSeleccionada('Panadería')}
                        >
                            <Text style={[styles.textoBotonOpcion, categoriaSeleccionada.toLowerCase() === 'panadería' && styles.textoBotonOpcionSeleccionada]}>Panadería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.categoriaBoton,
                                categoriaSeleccionada.toLowerCase() === 'repostería' && styles.categoriaBotonSeleccionada,
                            ]}
                            onPress={() => setCategoriaSeleccionada('Repostería')}
                        >
                            <Text style={[styles.textoBotonOpcion, categoriaSeleccionada.toLowerCase() === 'repostería' && styles.textoBotonOpcionSeleccionada]}>Repostería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.categoriaBoton,
                                categoriaSeleccionada.toLowerCase() === 'pastelería' && styles.categoriaBotonSeleccionada,
                            ]}
                            onPress={() => setCategoriaSeleccionada('Pastelería')}
                        >
                            <Text style={[styles.textoBotonOpcion, categoriaSeleccionada.toLowerCase() === 'pastelería' && styles.textoBotonOpcionSeleccionada]}>Pastelería</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {productos.map((item) => (
                    <View key={item.id}>{renderProductCard(item)}</View>
                ))}

            </ScrollView>
            <FAB
                style={styles.fab}
                icon={({ size, color }) => <Icon name="shopping-cart" size={size} color={color} />}
                onPress={() => { navigation.navigate('Carrito'); }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white'
    },
    cabecera: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 30,
        elevation: 1,
    },
    textoCabecera: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#DE0000",
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    contenedorOpciones: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
    },
    contenedorCategorias: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    categoriaBoton: {
        padding: 8,
    },
    categoriaBotonSeleccionada: {
        borderBottomWidth: 2,
        borderBottomColor: '#FA4A0C',
    },
    textoCategoria: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    textoCategoriaSeleccionada: {
        color: '#FA4A0C',
    },
    cardContainer: {
        borderRadius: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    productDetails: {
        flex: 1,
        padding: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    contenedorOpciones: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    categoriaBoton: {
        padding: 8,
    },
    categoriaBotonSeleccionada: {
        borderBottomWidth: 2,
        borderBottomColor: '#FA4A0C',
    },
    textoBotonOpcion: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'gray',
    },
    textoBotonOpcionSeleccionada: {
        color: '#FA4A0C',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#FA4A0C',
    },
});

export default HomeCliente;
