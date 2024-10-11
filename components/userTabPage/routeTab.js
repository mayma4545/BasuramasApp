import React, { useEffect, useState } from 'react';
import { Alert, View, Text } from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

export default function App() {
  const [location, setLocation] = useState({
    latitude: 12.366198,  // Masbate City latitude
    longitude: 123.614501, // Masbate City longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [html, setHtml] = useState(`
<!DOCTYPE html>
  <html>
  <head>
    <title>Leaflet Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #map {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      var map = L.map('map').setView([12.366198, 123.614501], 13); // Initial coordinates (Masbate City)

      // Adding the tile layer (map background)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Adding a marker at the coordinates
      var marker = L.marker([12.366198, 123.614501]).addTo(map)
        .bindPopup('Masbate City')
        .openPopup();
    </script>
  </body>
  </html>
`)

  //  Test with getCurrentPositionAsync instead of watchPositionAsync
   const getLocationOnce = async () => {
    try {
      let position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        
      });
  
      const { latitude, longitude } = position.coords;
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error('Error getting location:', error); // Log any errors that occur
      Alert.alert(`${error}`)
    }

  };
  useEffect(() => {
    let locationSubscription;

    const startTracking = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        // getLocationOnce();
        // const interv = setInterval(()=>{
        //   console.log("hi")
        // },5000)
        // Start watching the user's location in real-time with increased intervals for better performance
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced, // Use Balanced for better performance
            timeInterval: 1, // Update every 5 seconds
            distanceInterval: 1, // Update when the user moves by 10 meters
          },
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation((prevLocation) => ({
              ...prevLocation,
              latitude,
              longitude,
            }));
          }
        );
       
      } catch (error) {
        console.error('Error in startTracking:', error); // Log any errors that occur
        Alert.alert(`${error}`)
      }
    };

    startTracking();

    // Cleanup the subscription on component unmount
    return () => {
      // clearInterval(a)
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

 
  useEffect(()=>{
    console.log("hi")
   setHtml( `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leaflet Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #map {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([12.366198, 123.614501], 13); // Initial coordinates (Masbate City)
  
        // Adding the tile layer (map background)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
  
        // Adding a marker at the coordinates
        var marker = L.marker([12.3711, 123.6239]).addTo(map)
          .bindPopup('Masbate City')
          .openPopup();
      </script>
    </body>
    </html>
  `
  )
}, [location])

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: html }}
      style={{ flex: 1 }}
    />
  );
}
