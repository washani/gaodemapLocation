import React, { Component } from 'react';
import {StyleSheet, Image,View, PermissionsAndroid,ActivityIndicator } from "react-native";
import { init,Geolocation} from "react-native-amap-geolocation";
import { MapView, MapType } from "react-native-amap3d";
const geolib = require('geolib');

class App extends React.Component {

  state = {
    time: new Date(),
    latitude_ini:22.315637749566,
    longitude_ini:114.173653157553,
    ResturantData: [
      {"rest_id": "13", "rest_latitude": "22.313638509115", "rest_longitude": "114.174080132379", "rest_name": "Resturant_3"},  
      {"rest_id": "17","rest_latitude": "22.313085666233", "rest_longitude": "114.176091308594", "rest_name": "Resturant_5"}, 
      {"rest_id": "23", "rest_latitude": "22.318662651910", "rest_longitude": "114.175861545139", "rest_name": "Resturant_6"}, 
      {"rest_id": "29", "rest_latitude": "22.316692979601", "rest_longitude": "114.171250813803", "rest_name": "Resturant_7"}, 
      {"rest_id": "30", "rest_latitude": "22.315801323785", "rest_longitude": "114.175307888455", "rest_name": "Resturant_8"}, 
      {"rest_id": "31", "rest_latitude": "22.315248752171", "rest_longitude": "114.173729112414", "rest_name": "Resturant_9"}],
    ShopData:[
      {"shop_id": "2", "shop_latitude": "22.317159559462", "shop_longitude": "114.174665798612", "shop_name": "Shop_1"}, 
      {"shop_id": "5", "shop_latitude": "22.315187717014", "shop_longitude": "114.173663194445", "shop_name": "Shop_2"}, 
      {"shop_id": "31","shop_latitude": "22.315204535591", "shop_longitude": "114.174869791667", "shop_name": " Shop_3"}],
    showsTraffic: true,
    isLoading:true,
     region: {
        latitude: 22.315637749566,
        longitude: 114.173653157553,
        latitudeDelta:0.0069,
        longitudeDelta:0.0069,
      },
      position: 1,
      interval: null,
  };

componentDidMount () {
  setTimeout(() => {this.LocationData()}, 1000)
}

componentWillMount() {
  this.mounted = false;
  }
 
componentWillUnmount() {
    clearInterval(this.state.interval);
  }

LocationData = async() => {

    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
 
    await init({
    android: "Your High German Key"
    });

    await Geolocation.getCurrentPosition(({ coords }) => {
      this.setState({
          latitude_ini:coords.latitude,
          longitude_ini:coords.longitude,
          region: {latitude:coords.latitude,longitude:coords.longitude,latitudeDelta:0.0069,longitudeDelta:0.0069,},
      })
  });

  setTimeout(() => {
    this.getLocations();
  }, 2000)

}


// ===================== Locations data filter with nearest 500m ===================
getLocations = async() => {
  let {region } = this.state;
  this.setState({ isLoading: true });
  let markersRest = this.state.ResturantData.filter(markerrest => {
      let distance = this.calculateLocDistance(region.latitude, region.longitude, markerrest.rest_latitude, markerrest.rest_longitude);
      return distance <= 500;
    });

  let markersShop = this.state.ShopData.filter(markershop => {
      let distance = this.calculateLocDistance(region.latitude, region.longitude, markershop.shop_latitude, markershop.shop_longitude);
      return distance <= 500;
    });

  this.setState({
       ResturantData: markersRest,
       ShopData: markersShop,
       isLoading:false
    })

}

// this function uses geolib to calculate the distance between the points
calculateLocDistance(origingLat, origingLon, markerLocLat, markerLocLon) {
  return geolib.getDistance(
    {latitude: origingLat, longitude: origingLon},
    {latitude: markerLocLat, longitude: markerLocLon}
  );
}


render(){
    return (
    <>
     <MapView 
        style={StyleSheet.absoluteFill}
        mapType={MapType.Bus}
        showsTraffic={this.state.showsTraffic}
        region={{
          latitude:this.state.latitude_ini,
          longitude:this.state.longitude_ini,
          latitudeDelta:0.0069,
          longitudeDelta:0.0069,
        }}
     >

       <MapView.Marker
          active
          title="Current Location"
          zoomLevel= '16'
          icon={() => (
            <View >
              <Image source={require('./img/marker.png')} style={{height: 35, width:35 }} />
            </View>
          )}
          coordinate={{
              latitude:this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
        />

      {this.state.ResturantData.map(item => (
          <MapView.Marker
            title={"Name: " + item.rest_name}
            coordinate={{
              latitude:JSON.parse(item.rest_latitude),
              longitude:JSON.parse(item.rest_longitude),
            }}
            icon={() => (
            <View >
              <Image source={require('./img/foodlocation.png')} style={{height: 25, width:25 }} />
            </View>
          )}
          >
          </MapView.Marker>
            
       ))}

      {this.state.ShopData.map(item => (
          <MapView.Marker
             title={"Name: " + item.shop_name}
            coordinate={{
              latitude:JSON.parse(item.shop_latitude),
              longitude:JSON.parse(item.shop_longitude),
            }}
            icon={() => (
            <View >
              <Image source={require('./img/shoplocation.png')} style={{height: 25, width:25 }} />
            </View>
          )}
          />
       ))}

      </MapView>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#5B5552" animating={this.state.isLoading}/>
        </View>

    </>

      );
    };
  }

export default App;