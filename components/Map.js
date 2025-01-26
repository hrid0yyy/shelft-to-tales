import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the icons

const App = ({ cancelBtn, setMap }) => {
  const [location, setLocation] = useState(null); // Current location
  const [initialLocation, setInitialLocation] = useState(null); // Initial location

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      setInitialLocation(coords); // Store the initial location
    };

    fetchLocation();
  }, []);

  const handleLocationChange = (coordinate) => {
    // Update the location state
    setLocation(coordinate);
    setMap(coordinate);
    // Print the latitude and longitude to the console
    console.log("Selected Location:", coordinate);
  };

  const resetLocation = () => {
    // Reset the marker back to the initial location
    cancelBtn(false);
  };

  const confirmLocation = () => {
    // Placeholder for tick button functionality
    cancelBtn(false);
  };

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => {
              // Pass the selected coordinates to the handler
              handleLocationChange(e.nativeEvent.coordinate);
            }}
          >
            {/* Marker for the current/selected location */}
            <Marker
              coordinate={location}
              title="Current Position"
              description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
            />
          </MapView>

          {/* Cross Icon Button */}
          <TouchableOpacity style={styles.crossButton} onPress={resetLocation}>
            <Ionicons name="close-circle" size={50} color="red" />
          </TouchableOpacity>

          {/* Tick Icon Button */}
          <TouchableOpacity style={styles.tickButton} onPress={confirmLocation}>
            <Ionicons name="checkmark-circle" size={50} color="green" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  crossButton: {
    position: "absolute",
    top: 20,
    right: 80, // Adjusted position for spacing with the tick button
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 5,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tickButton: {
    position: "absolute",
    top: 20,
    right: 20, // Tick button placed closer to the right edge
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 5,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default App;
