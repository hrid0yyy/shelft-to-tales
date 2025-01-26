import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchMapData } from "@/utils/exchange";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ExchangeMap() {
  const [mapData, setMapData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // For custom callouts
  const router = useRouter();

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    const fetchData = async () => {
      await fetchUserLocation();
      const response = await fetchMapData();
      setMapData(response); // Set fetched data
    };

    fetchData();
  }, []);

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={hp("3%")} color="black" />
      </TouchableOpacity>

      {/* Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => router.push("/screens/ExchangeBooks")}
      >
        <Ionicons name="add" size={hp("3%")} color="white" />
      </TouchableOpacity>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation
        customMapStyle={lightMapStyle} // Apply custom map style
      >
        {mapData.map((item) => (
          <Marker
            key={item.exchangeId}
            coordinate={{
              latitude: item.map.latitude,
              longitude: item.map.longitude,
            }}
            onPress={() => setSelectedItem(item)} // Set the selected item for directions
          >
            {/* Custom Icon */}
            <Image
              source={{ uri: "https://img.icons8.com/fluency/48/marker.png" }}
              style={styles.markerIcon}
            />
          </Marker>
        ))}

        {/* Draw Directions */}
        {selectedItem && (
          <MapViewDirections
            origin={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            destination={{
              latitude: selectedItem.map.latitude,
              longitude: selectedItem.map.longitude,
            }}
            apikey={"YOUR_GOOGLE_MAPS_API_KEY"} // Replace with your Google Maps API Key
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>

      {/* Custom Callout */}
      {selectedItem && (
        <View style={styles.calloutOverlay}>
          <Image
            source={{ uri: selectedItem.image }}
            style={styles.calloutImage}
          />
          <View style={styles.calloutTextContainer}>
            <TouchableOpacity
              onPress={() => {
                router.replace(
                  `/screens/ExchangeBooksDetails?exchangeId=${selectedItem.exchangeId}`
                );
              }}
            >
              <Text style={styles.calloutTitle}>{selectedItem.title}</Text>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: selectedItem.users.profile_url }}
                style={styles.profilePicture}
              />
              <Text style={styles.calloutUsername}>
                {selectedItem.users.username}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedItem(null)} // Close the callout and route
          >
            <Ionicons name="close" size={hp("3%")} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: hp("2.5%"),
    color: "#555",
  },
  backButton: {
    position: "absolute",
    top: hp("5%"),
    left: wp("5%"),
    zIndex: 2,
    backgroundColor: "white",
    padding: wp("2%"),
    borderRadius: wp("2%"),
    elevation: 5,
  },
  plusButton: {
    position: "absolute",
    top: hp("5%"),
    right: wp("5%"),
    zIndex: 2,
    backgroundColor: "#3c6960",
    padding: wp("2%"),
    borderRadius: wp("2%"),
    elevation: 5,
  },
  markerIcon: {
    width: wp("8%"),
    height: wp("8%"),
    resizeMode: "contain",
  },
  calloutOverlay: {
    position: "absolute",
    bottom: hp("10%"),
    left: wp("10%"),
    right: wp("10%"),
    backgroundColor: "white",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calloutImage: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("2%"),
    marginBottom: wp("2%"),
  },
  calloutTextContainer: {
    alignItems: "center",
  },
  calloutTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: wp("2%"),
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: wp("2%"),
  },
  profilePicture: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    marginRight: wp("2%"),
  },
  calloutUsername: {
    fontSize: wp("4%"),
    color: "#333",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: wp("2%"),
    right: wp("2%"),
    backgroundColor: "white",
    padding: wp("1%"),
    borderRadius: wp("5%"),
  },
});

const lightMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dcdcdc" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#c9e8f7" }],
  },
];
