import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'; // Reemplazamos 'Button' por 'TouchableOpacity'
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const EditarProducto = ({ route, navigation }) => {
    const { producto } = route.params;
    const [nombre, setNombre] = useState(producto.nombre);
    const [categoria, setCategoria] = useState(producto.categoria);
    const [precio, setPrecio] = useState(producto.precio.toString());
    const [existencia, setExistencia] = useState(producto.existencia.toString());

    const db = getFirestore();
    const productosRef = doc(db, 'productos', producto.id);

    const handleGuardarCambios = async () => {
        try {
            await updateDoc(productosRef, {
                nombre,
                categoria: categoria,
                precio: parseFloat(precio),
                existencia: parseInt(existencia),
                imagen: producto.imagen,
            });

            console.log('Producto actualizado con éxito');

            navigation.goBack();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={styles.label}>Categoría:</Text>
            <TextInput
                style={styles.input}
                value={categoria}
                onChangeText={setCategoria}
            />

            <Text style={styles.label}>Precio:</Text>
            <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Existencia:</Text>
            <TextInput
                style={styles.input}
                value={existencia}
                onChangeText={setExistencia}
                keyboardType="numeric"
            />
            
            <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F2F2F2',
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FA4A0C",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EditarProducto;
