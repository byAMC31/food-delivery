import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

export default function Mapa({ navigation }) {

    const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });

    const getLocationUser = async () => {
        let currentLocation = await Location.getCurrentPositionAsync({});

        const latitude = currentLocation.coords.latitude;
        const longitude = currentLocation.coords.longitude;
        return { latitude, longitude };
    };

    useEffect(() => {
        const fetchUserLocation = async () => {
            const userLocation = await getLocationUser();
            setOrigin(userLocation);
        };

        fetchUserLocation();
    }, []);

    const [destination, setDestination] = useState({
        latitude: 17.0800,
        longitude: -96.7300,
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04
                }}
            >
                <Marker
                    draggable
                    coordinate={origin}
                    image={require('../assets/cheems.png')}
                //   onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                />
                <Marker
                    draggable
                    coordinate={destination}
                //   onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
                />
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={'AIzaSyDbfd69VerzlrKDwiCjRwrf28jTBMwzDfI'}
                    strokeColor="red"
                    strokeWidth={5}
                />
                <Polyline
                    coordinates={[origin, destination]}
                    strokeColor="pink"
                    strokeWidth={8}
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    }
})