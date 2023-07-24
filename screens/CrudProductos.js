import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Image } from 'react-native-elements';
import { FAB } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';

const CrudProductos = ({ navigation }) => {
    const [productos, setProductos] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const productosRef = collection(db, 'productos');
                const q = query(productosRef);

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
    }, []);

    const handleFloatingButton = () => {
        navigation.navigate('CrearProducto');
    };

    const renderProductCard = (item) => (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardContent}>
                <Image source={{ uri: item.imagen }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.nombre}</Text>
                    <Text style={styles.productCategory}>{item.categoria}</Text>
                    <Text style={styles.productPrice}>Precio: ${item.precio}</Text>
                    <Text style={styles.productStock}>Stock: {item.existencia}</Text>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="edit"
                            size={24}
                            color="gray"
                            onPress={() => {
                                console.log('Editar producto:', item.id);
                                navigation.navigate('EditarProducto', { producto: item });
                            }}
                        />
                        <Icon
                            name="delete"
                            size={24}
                            color="red"
                            onPress={async () => {
                                try {
                                    // Obtener la referencia al documento del producto que se va a eliminar
                                    const id = item.id
                                    const productoRef = doc(db, 'productos', id);

                                    // Eliminar el producto de la base de datos
                                    await deleteDoc(productoRef);

                                    // Actualizar la lista de productos después de eliminar
                                    setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));

                                    console.log('Producto eliminado con éxito');
                                } catch (error) {
                                    console.error('Error al eliminar el producto:', error);
                                }
                            }}
                        />
                    </View>
                </View>
            </View>
        </Card>
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                {productos.map((item) => (
                    <View key={item.id}>{renderProductCard(item)}</View>
                ))}
                <FAB style={styles.fab} icon="plus" onPress={handleFloatingButton} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F2F2F2',
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
    productCategory: {
        fontSize: 14,
        color: 'gray',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    productStock: {
        fontSize: 14,
        color: 'gray',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#FA4A0C',
    },
});

export default CrudProductos;
