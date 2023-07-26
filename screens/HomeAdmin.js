import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeAdmin({ navigation }) {
    const options = [
        {
            title: 'Gestionar productos',
            route: 'CrudProductos',
            imageUri: 'https://img.freepik.com/vector-premium/marco-fondo-rosa-dulce-abstracto-postres-cupcakes-helado-donut-pastel-caramelo_658748-381.jpg?w=2000',
            description: 'Administra los productos de repostería, panadería y pastelería en tu negocio. Agrega nuevos productos, actualiza información y elimina aquellos que ya no estén disponibles.',
        },
        {
            title: 'Administrar Repartidores',
            route: 'CrudRepartidor',
            imageUri: 'https://media.istockphoto.com/id/528729374/es/vector/r%C3%A1pida-entrega-el-chico-en-la-bicicleta-prisa.jpg?s=612x612&w=0&k=20&c=dC9sPZFt9qoD_rOQEPYGm2BsKyORtF0i_-mUO6_6gxg=',
            description: 'Gestiona a tus repartidores de manera eficiente. Añade nuevos repartidores, actualiza sus datos y asigna tareas de entrega.',
        },
    ];

    return (
        <ScrollView>
            <View style={styles.container}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionCard}
                        onPress={() => navigation.navigate(option.route)}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: option.imageUri }}
                        />
                        <Text style={styles.title}>{option.title}</Text>
                        <Text style={styles.description}>
                            {option.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    optionCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        color: '#666',
        marginBottom: 10,
    },
});
