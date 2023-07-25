import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Picker } from "@react-native-picker/picker";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import appFirebase from '../firebase-config';
import 'firebase/storage';

const CrearProducto = () => {
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [existencia, setExistencia] = useState("");
    const [imagenUri, setImagenUri] = useState(null);

    const db = getFirestore();
    const storage = getStorage(appFirebase);

    const manejarInputNombre = (texto) => {
        setNombre(texto);
    };

    const manejarInputPrecio = (texto) => {
        setPrecio(texto);
    };

    const manejarInputExistencia = (texto) => {
        setExistencia(texto);
    };

    const isImageFile = (fileName) => {
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return allowedExtensions.includes(extension);
    };

    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Lo sentimos, necesitamos permisos para acceder a la galería de imágenes.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const selectedAsset = result.assets[0];

                if (!isImageFile(selectedAsset.uri)) {
                    Alert.alert(
                        'Formato de archivo incorrecto',
                        'Por favor, selecciona un archivo con extensión .png, .jpg o .jpeg.'
                    );
                    return;
                }

                const randomName = () => {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let name = '';
                    for (let i = 0; i < 10; i++) {
                        const randomIndex = Math.floor(Math.random() * chars.length);
                        name += chars[randomIndex];
                    }
                    return name;
                };

                const extension = selectedAsset.uri.substring(selectedAsset.uri.lastIndexOf('.'));
                const fileName = `${randomName()}${extension}`;

                const localUri = FileSystem.documentDirectory + fileName;

                try {
                    await FileSystem.copyAsync({
                        from: selectedAsset.uri,
                        to: localUri,
                    });

                    setImagenUri(localUri);

                    const storageRef = ref(storage, fileName);
                    uploadBytes(storageRef, localUri).then((snapshot) => {
                        console.log('¡Imagen subida con éxito!');
                        console.log(localUri);
                    });
                } catch (error) {
                    console.log('Error al copiar la imagen: ', error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    const agregarProducto = async () => {
        try {
            if (
                nombre.trim() === "" ||
                categoria.trim() === "" ||
                precio.trim() === "" ||
                existencia.trim() === ""
            ) {
                Alert.alert("Error", "Todos los campos son obligatorios");
                return;
            }

            const nuevoProducto = {
                nombre,
                categoria: categoria,
                precio: parseFloat(precio),
                existencia: parseInt(existencia),
                // imagen: imagenUri,
                imagen: 'https://st.depositphotos.com/1775303/52092/i/600/depositphotos_520920946-stock-photo-the-female-mannequin-on-the.jpg'
            };

            const docRef = await addDoc(collection(db, "productos"), nuevoProducto);
            console.log("Documento agregado con ID:", docRef.id);

            Alert.alert("Éxito", "Producto agregado correctamente");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            Alert.alert(
                "Error",
                "Hubo un error al agregar el producto. Por favor, inténtalo de nuevo."
            );
        }
    };

    return (
        <View style={styles.container}>
            {imagenUri ? (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={selectImage}>
                        <Image source={{ uri: imagenUri }} style={styles.previewImage} />
                    </TouchableOpacity>
                </View>
            ) :
                (<TouchableOpacity
                    style={styles.buttonImage}
                    onPress={selectImage}
                >
                    <Text style={[styles.buttonText, { color: 'black', height: 80, textAlignVertical: 'center' }]}>Seleccionar imagen</Text>
                </TouchableOpacity>
                )}

            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del producto"
                onChangeText={manejarInputNombre}
            />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={categoria}
                    onValueChange={(itemValue) => setCategoria(itemValue)}
                >
                    <Picker.Item label="Selecciona una categoría..." value="" />
                    <Picker.Item label="Repostería" value="Repostería" />
                    <Picker.Item label="Pastelería" value="Pastelería" />
                    <Picker.Item label="Panadería" value="Panadería" />
                </Picker>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.flexContainer}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput
                        style={[styles.input, styles.flexInput]}
                        placeholder="Precio del producto"
                        keyboardType="numeric"
                        onChangeText={manejarInputPrecio}
                    />
                </View>
                <View style={styles.flexContainer}>
                    <Text style={styles.label}>Existencia:</Text>
                    <TextInput
                        style={[styles.input, styles.flexInput]}
                        placeholder="Stock del producto"
                        keyboardType="numeric"
                        onChangeText={manejarInputExistencia}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={agregarProducto}
            >
                <Text style={styles.buttonText}>Agregar Producto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F2F2F2",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: "gray",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FA4A0C",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 15,
    },
    buttonImage: {
        marginBottom: 20,
        backgroundColor: '#F2F2F2',
        borderStyle: 'dashed',
        borderWidth: 1,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    previewImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        // marginBottom: 15,
    },
    pickerContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexContainer: {
        flex: 1,
    },
    flexInput: {
        width: '95%'
    },
});

export default CrearProducto;
