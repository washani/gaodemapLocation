# React Native nearest location shop &amp; restaurant
Base on your current location find nearest shop and resturant locations.

<img src="img/map_2.jpg" width="30%">

## Related project recommendations:
* [React native amap geolocation](https://github.com/qiuxiang/react-native-amap-geolocation)
* [React-native-amap3d](https://www.npmjs.com/package/react-native-amap3d)
* [Geolib](https://www.npmjs.com/package/geolib)

## Add Gaode Key:
* Get key [High German Key](https://lbs.amap.com/api/android-sdk/guide/create-project/get-key)
* Add the following code in to `AndroidManifest.xml` file within `<application>`:
```xml
<meta-data  
 android:name = " com.amap.api.v2.apikey " 
 android:value = "Your High German Key "
/>
```
## Get current Location
Get current location and `setState` latitude & longitude
```javascrit
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
          region: {
                    latitude:coords.latitude,
                    longitude:coords.longitude,
                    latitudeDelta:0.0069,
                    longitudeDelta:0.0069,
                  },
      })
  });
```
