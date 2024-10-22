import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import axiosConfig from '../../staticVar.js/axiosConfig';
import StoreDataAsync from '../../staticVar.js/utilityFunctions';

export default function DriverRoutePage() {
  const [location, setLocation] = useState({
    latitude: 12.366198,  // Masbate City latitude
    longitude: 123.614501, // Masbate City longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const webviewRef = useRef(null);

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

        // Adding a marker at the initial coordinates
        var marker = L.marker([12.366198, 123.614501]).addTo(map)
          .bindPopup('Truck Driver')
          .openPopup();

        // Function to update marker and center without reloading the map
        function updateMarkerAndCenter(lat, lng) {
          marker.setLatLng([lat, lng]).update();
          map.setView([lat, lng], map.getZoom()); // Keep the current zoom level
        }

        // Listen for location updates from React Native WebView
        window.document.addEventListener('message', function(event) {
          const { latitude, longitude } = JSON.parse(event.data);
          updateMarkerAndCenter(latitude, longitude);
        });
      </script>
    </body>
    </html>
  `);

  const startTracking = async () => {
    try {
          
          const {data} = await axiosConfig.get("/location")
          const {latitude, longitude} = data.location
          
          // Send location data to the WebView
          if (webviewRef.current) {
            webviewRef.current.postMessage(JSON.stringify({ latitude, longitude }));
          }
    
    } catch (error) {
      console.error('Error in startTracking:', error);
      Alert.alert(`${error}`);
    }
  };

  useEffect(() => {
   const s = setInterval(()=>{
    startTracking();
   },1000)
   StoreDataAsync("mapInterval", JSON.stringify(s))
  }, []);

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: html }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        console.log("Received message from WebView:", event.nativeEvent.data);
      }}
    />
  );
}
