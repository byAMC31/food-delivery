import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function HomeAdmin({ navigation }) {
    const options = [
        // { title: 'CRUD Repartidor', route: 'CrudRepartidor' },
        { title: 'CRUD Productos', route: 'CrudProductos' },
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
                    <Text style={styles.optionText}>{option.title}</Text>
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
        fontSize: 18,
    },
});
