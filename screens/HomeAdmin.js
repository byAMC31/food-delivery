import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function HomeAdmin({ navigation }) {
    const options = [
        
        { title: 'CRUD Productos', route: 'CrudProductos' },
        { title: 'CRUD Repartidor', route: 'HomeRepartidor' },
        //{ title: 'CRUD cliente', route: 'HomeCliente' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Opciones del Administrador:</Text>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.optionCard}
                    onPress={() => navigation.navigate(option.route)}
                >
                    <Text style={styles.button}>{option.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionCard: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    optionText: {
        backgroundColor: "#FA4A0C",
        fontSize: 18,
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
