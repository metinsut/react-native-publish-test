import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   Platform,
   TouchableOpacity
} from 'react-native';
import { MapView } from 'expo';
import { Constants, Location, Permissions } from 'expo';

export default class App extends React.Component {
   state = {
      location: null,
      errorMessage: null,
      region: {
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421
      }
   };

   componentDidMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
         this.setState({
            errorMessage:
               'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
         });
      } else {
         this._getLocationAsync();
      }
   }

   _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
         this.setState({
            errorMessage: 'Permission to access location was denied'
         });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
   };

   setLocation = async () => {
      await this._getLocationAsync();
      this.setState({
         region: {
            ...this.state.region,
            longitude: this.state.location.coords.longitude,
            latitude: this.state.location.coords.latitude,
            latitudeDelta: 0.009,
            longitudeDelta: 0.004
         }
      });
   };

   setMarkers() {
      return <MapView.Marker coordinate={this.state.region} />;
   }

   render() {
      let text = 'Waiting..';
      if (this.state.errorMessage) {
         text = this.state.errorMessage;
      } else if (this.state.location) {
         text = JSON.stringify(this.state.location);
      }
      cor = JSON.stringify(this.state.coordinate);
      return (
         <View style={styles.container}>
            <MapView style={{ flex: 1 }} region={this.state.region}>
               {this.setMarkers()}
            </MapView>
            <View style={styles.center}>
               <TouchableOpacity
                  onPress={this.setLocation}
                  style={styles.button}
               >
                  <Text style={styles.text1}>Set My Location</Text>
               </TouchableOpacity>
               <Text style={styles.paragraph}>{text}</Text>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   paragraph: {
      margin: 24,
      fontSize: 18,
      textAlign: 'center'
   },
   center: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#C4D6D0'
   },
   button: {
      backgroundColor: '#0E4D64',
      borderRadius: 5,
      padding: 10,
      marginTop:10
   },
   text1: {
      color: 'white',
      fontSize: 20
   }
});
