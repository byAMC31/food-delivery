import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const Login = ({ navigation }) => {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState("iniciarSesion");
    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [nombre, setNombre] = useState("");

    const manejarPresionarOpcion = (opcion) => {
        setOpcionSeleccionada(opcion);
        setMostrarFormulario(true);
    };

    const manejarInputEmail = (texto) => {
        setEmail(texto);
    };

    const manejarInputContrasena = (texto) => {
        setContrasena(texto);
    };

    const manejarInputNombre = (texto) => {
        setNombre(texto);
    };

    const manejarRegistro = () => {
        console.log("Botón Registrarse");
    };

    const manejarIngresar = () => {
        if (email.trim() === "" || contrasena === "") {
            console.log("Campos vacíos");
            return;
        }

        const usuariosPrueba = [{ email: "admin", contrasena: "123" }];

        const usuario = usuariosPrueba.find(
            (user) => user.email === email && user.contrasena === contrasena
        );

        if (usuario) {
            console.log("Conectado");
            navigation.navigate('Home')
        } else {
            console.log("No existe");
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

            {mostrarFormulario && (
                <View style={styles.contenedorFormulario}>
                    <View style={styles.campoFormulario}>
                        {opcionSeleccionada === "iniciarSesion" ? (
                            <>
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
                                <TouchableOpacity
                                    style={styles.botonIngresar}
                                    onPress={manejarIngresar}
                                >
                                    <Text style={styles.textoBotonIngresar}>Ingresar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.etiqueta}>Nombre:</Text>
                                <TextInput
                                    style={styles.entrada}
                                    placeholder="Ingresa tu nombre"
                                    onChangeText={manejarInputNombre}
                                    underlineColorAndroid="transparent"
                                />

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
                                <TouchableOpacity
                                    style={styles.botonIngresar}
                                    onPress={manejarRegistro}
                                >
                                    <Text style={styles.textoBotonIngresar}>Registrarse</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            )}
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

export default Login;