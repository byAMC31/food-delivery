import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
} from "react-native";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import appFirebase from '../firebase-config';
import { setDoc, collection, getFirestore, query, where, getDocs, doc, addDoc, deleteDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons';


const CrudRepartidor = ({ navigation }) => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState("Lista");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [repartidores, setRepartidores] = useState([]);
    const auth = getAuth(appFirebase)
    const db = getFirestore();

    useEffect(() => {
        fetchRepartidores();
    }, []);

    const fetchRepartidores = async () => {
        try {
            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("rol", "==", "repartidor"));
            const querySnapshot = await getDocs(q);
            const repartidoresData = querySnapshot.docs.map((doc) => doc.data());
            setRepartidores(repartidoresData);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un error al cargar los repartidores");
        }
    };

    const manejarPresionarOpcion = (opcion) => {
        setOpcionSeleccionada(opcion);
    };

    const manejarInputEmail = (texto) => {
        setEmail(texto);
    };

    const manejarInputContrasena = (texto) => {
        setContrasena(texto);
    };

    const manejarRegistro = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, contrasena);

            const userData = {
                email: user.email,
                rol: "repartidor",
            };

            await setDoc(doc(db, "usuarios", user.uid), userData);

            setOpcionSeleccionada("Lista");
            setEmail("");
            setContrasena("");
            Alert.alert('Repartidor registrado', 'Repartidor registrado exitosamente.');
            fetchRepartidores();
        } catch (error) {
            console.error(error);

            switch (error.code) {
                case "auth/invalid-email":
                    Alert.alert("Error de registro", "Correo electrónico inválido.");
                    break;
                case "auth/weak-password":
                    Alert.alert("Error de registro", "La contraseña debe tener al menos 6 caracteres.");
                    break;
                case "auth/email-already-in-use":
                    Alert.alert("Error de registro", "El correo electrónico ya está en uso. Prueba con otro.");
                    break;
                default:
                    Alert.alert("Error de registro", "Hubo un error al registrar al repartidor. Por favor, inténtalo de nuevo.");
            }
        }
    };

    const manejarBorrarRepartidor = async (email) => {
        try {
            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const repartidorDocRef = doc.ref;
                    await deleteDoc(repartidorDocRef);
                    Alert.alert("Repartidor borrado", "El repartidor ha sido eliminado correctamente.");
                    fetchRepartidores();
                });
            } else {
                Alert.alert("Error", "No se encontró el repartidor en la base de datos.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un error al borrar al repartidor");
        }
    };

    const renderRepartidorItem = ({ item }) => (
        <View style={styles.repartidorItem}>
            <Text style={styles.repartidorEmail}>{item.email}</Text>
            <TouchableOpacity onPress={() => manejarBorrarRepartidor(item.email)} style={styles.botonBorrar}>
                <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Image source={require("../assets/logo.png")} style={styles.logo} />
                <View style={styles.contenedorOpciones}>
                    <TouchableOpacity
                        style={[
                            opcionSeleccionada === "Lista" && styles.opcionSeleccionada,
                        ]}
                        onPress={() => manejarPresionarOpcion("Lista")}
                    >
                        <Text style={styles.textoBotonOpcion}>Lista</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            opcionSeleccionada === "Registrar" && styles.opcionSeleccionada,
                        ]}
                        onPress={() => manejarPresionarOpcion("Registrar")}
                    >
                        <Text style={styles.textoBotonOpcion}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.contenedorFormulario}>
                {opcionSeleccionada === "Lista" ? (
                    <FlatList
                        data={repartidores}
                        renderItem={renderRepartidorItem}
                        keyExtractor={(item) => item.email}
                        contentContainerStyle={styles.listaRepartidores}
                    />
                ) : (
                    <View style={styles.campoFormulario}>
                        <Text style={styles.etiqueta}>Email:</Text>
                        <TextInput
                            style={styles.entrada}
                            placeholder="Ingresa el email"
                            onChangeText={manejarInputEmail}
                            value={email}
                            underlineColorAndroid="transparent"
                        />

                        <Text style={styles.etiqueta}>Contraseña:</Text>
                        <TextInput
                            style={styles.entrada}
                            placeholder="Ingresa la contraseña"
                            onChangeText={manejarInputContrasena}
                            value={contrasena}
                            secureTextEntry
                            underlineColorAndroid="transparent"
                        />

                        <TouchableOpacity style={styles.botonIngresar} onPress={manejarRegistro}>
                            <Text style={styles.textoBotonIngresar}>Registrar Repartidor</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#F2F2F2'
    },
    cabecera: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 2,
    },
    textoCabecera: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#DE0000",
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 5,
    },
    contenedorOpciones: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        marginTop: 20,
    },
    textoBotonOpcion: {
        fontWeight: "bold",
        fontSize: 18,
    },
    contenedorFormulario: {
        flex: 3,
        backgroundColor: "#F2F2F2",
        justifyContent: "center",
        alignItems: "center",
    },
    campoFormulario: {
        width: "90%",
        padding: 20,
    },
    etiqueta: {
        fontSize: 16,
        fontWeight: "bold",
        color: "gray",
        marginBottom: 8,
    },
    entrada: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: "gray",
        marginBottom: 20,
    },
    botonIngresar: {
        backgroundColor: "#FA4A0C",
        padding: 10,
        borderRadius: 30,
        marginTop: 20,
    },
    textoBotonIngresar: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    opcionSeleccionada: {
        borderBottomWidth: 3,
        borderColor: "#FA4A0C",
    },
    listaRepartidores: {
        paddingVertical: 10,
    },
    repartidorItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "gray",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    repartidorEmail: {
        fontSize: 16,
        color: "black",
    },
    botonBorrar: {
        padding: 5,
    },
});

export default CrudRepartidor;
