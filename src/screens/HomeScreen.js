// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/
// Import React
import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
// Import Map and Marker
import MapView, {
  Marker,
  MarkerAnimated,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {ROUTES_NAME} from '../utlis/constants';
import {useNavigation, useTheme} from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyA9kvnF0wduRP-oez8xZPZv1gr17blvYp8', {language: 'en'});
const HomeScreen = () => {
  const [position, setPosition] = useState(null);
  const {colors} = useTheme();
  const [address, setAddress] = useState({address: null, error: null});
  const navigation = useNavigation();
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setPosition(pos);
       getGeoLocationAddress(pos);
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };
  const getGeoLocationAddress=({coords:{latitude,longitude}})=>{
    Geocoder.from(latitude, longitude)
    .then(json => {
      var addressComponent = json.results[0].formatted_address;
      setAddress({address: addressComponent, error: null});
    })
    .catch(error => {
      console.warn(error);
      setAddress({address: null, error: JSON.stringify(error)});
    });
  }
  useEffect(() => {
    const backAction = () => {
      navigation.navigate(ROUTES_NAME.DASH.name)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    getCurrentPosition();
  }, []);

  const navigate = () => {
    navigation.navigate(ROUTES_NAME.REPORTER.name, {
      address,
      latitude: position?.coords?.latitude,
      longitude:position?.coords?.longitude
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {/*    <Text>
        <Text style={styles.title}>Current position: </Text>
        {JSON.stringify(position)}
      </Text>
      <Button title="Get Current Position" onPress={getCurrentPosition} /> */}

        {position && (
          <MapView
            style={{flex: 1}}
            initialRegion={{
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            initialCamera={{
              center: {
                latitude:  position?.coords?.latitude,
                longitude: position?.coords?.longitude,
              },
              pitch: 45,
              heading: 90,
              altitude: 0,
              zoom: 20
            }}
            customMapStyle={[]}
            onPress={({
              nativeEvent: {
                coordinate: {latitude, longitude},
              },
            }) => {
              setPosition({coords: {latitude, longitude}});
              getGeoLocationAddress({coords: {latitude, longitude}});
            }}
            provider={PROVIDER_DEFAULT}
            mapType="standard"
            zoomEnabled={true}
            pitchEnabled={true}
            showsUserLocation={false}
            followsUserLocation={true}
            showsCompass={true}
            showsBuildings={true}
            showsTraffic={false}
            showsIndoors={false}
            showsMyLocationButton={true}
            zoomControlEnabled={true}
            moveOnMarkerPress={true}
            onMarkerDragEnd={({nativeEvent:{coordinate:{latitude,longitude}}})=>{
              setPosition({coords: {latitude, longitude}});
              getGeoLocationAddress({coords: {latitude, longitude}});
            }}
            >
            <MarkerAnimated
              draggable={true}
              coordinate={{
                latitude: position?.coords?.latitude,
                longitude: position?.coords?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              
            />
          </MapView>
        )}
        <TouchableOpacity onPress={this.takeSnapshot}>
          <Button title="Next" onPress={navigate} color={colors.green}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
