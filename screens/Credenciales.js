import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import appFirebase from '../firebase-config';
import { setDoc, collection, getFirestore, query, where, getDocs, doc, addDoc } from "firebase/firestore";

const Credenciales = ({ navigation }) => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState("iniciarSesion");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");

    const auth = getAuth(appFirebase)
    const db = getFirestore();

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
                rol: "cliente",
            };

            // Crear el documento del usuario en la colección "usuarios"
            await setDoc(doc(db, "usuarios", user.uid), userData);

            // Crear la colección "carrito" para el usuario recién registrado
            const carritoRef = collection(db, "usuarios", user.uid, "carrito");
            await addDoc(carritoRef, { productos: [] });

            setOpcionSeleccionada('iniciarSesion');
            Alert.alert('Usuario registrado', 'Ya puedes iniciar sesión');
            console.log("Usuario registrado", user.uid);
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
                    Alert.alert("Error de registro", "Hubo un error al registrar al usuario. Por favor, inténtalo de nuevo.");
            }
        }
    };


    const manejarIngresar = async () => {
        if (email.trim() === "" || contrasena === "") {
            console.log("Campos vacíos");
            return;
        }

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, contrasena);

            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();

                    switch (userData.rol) {
                        case "admin":
                            console.log('admin log');
                            navigation.navigate("HomeAdmin");
                            break;
                        case "repartidor":
                            console.log('rep log');
                            navigation.navigate("HomeRepartidor");
                            break;
                        default:
                            console.log('clit log');
                            navigation.navigate("HomeCliente");
                    }
                });
            } else {
                console.log("Usuario no encontrado en la colección 'usuarios'");
            }
        } catch (error) {
            console.error(error);

            switch (error.code) {
                case "auth/invalid-email":
                    Alert.alert("Error de inicio de sesión", "Correo electrónico inválido.");
                    break;
                case "auth/wrong-password":
                    Alert.alert("Error de inicio de sesión", "Contraseña incorrecta.");
                    break;
                case "auth/user-not-found":
                    Alert.alert("Error de inicio de sesión", "El usuario no existe.");
                    break;
                default:
                    Alert.alert("Error de inicio de sesión", "Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.");
            }
        }
    };


    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.textoCabecera}>Entrega de Comida</Text>
                <Image source={require("../assets/logo.png")} style={styles.logo} />
                <View style={styles.contenedorOpciones}>
                    <TouchableOpacity
                        style={[opcionSeleccionada === "iniciarSesion" && styles.opcionSeleccionadaIniciarSesion]}
                        onPress={() => manejarPresionarOpcion("iniciarSesion")}
                    >
                        <Text style={styles.textoBotonOpcion}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            opcionSeleccionada === "registro" && styles.opcionSeleccionadaRegistro,
                        ]}
                        onPress={() => manejarPresionarOpcion("registro")}
                    >
                        <Text style={styles.textoBotonOpcion}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.contenedorFormulario}>
                <View style={styles.campoFormulario}>
                    <Text style={styles.etiqueta}>Email:</Text>
                    <TextInput
                        style={styles.entrada}
                        placeholder="Ingresa tu email"
                        onChangeText={manejarInputEmail}
                        underlineColorAndroid="transparent"
                    />

                    <Text style={styles.etiqueta}>Contraseña:</Text>
                    <TextInput
                        style={styles.entrada}
                        placeholder="Ingresa tu contraseña"
                        onChangeText={manejarInputContrasena}
                        secureTextEntry
                        underlineColorAndroid="transparent"
                    />

                    {opcionSeleccionada === "iniciarSesion" ? (
                        <TouchableOpacity style={styles.botonIngresar} onPress={manejarIngresar}>
                            <Text style={styles.textoBotonIngresar}>Ingresar</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.botonIngresar} onPress={manejarRegistro}>
                            <Text style={styles.textoBotonIngresar}>Registrarse</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    opcionSeleccionadaIniciarSesion: {
        borderBottomWidth: 3,
        borderColor: "#FA4A0C",
    },
    opcionSeleccionadaRegistro: {
        borderBottomWidth: 3,
        borderColor: "#FA4A0C",
    },
});

export default Credenciales;