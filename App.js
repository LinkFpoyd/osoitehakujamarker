import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [koordinaatit, setKoordinaatit] = useState({latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221})
  const [marker, setMarker] = useState({latitude: 60.200692,longitude: 24.934302});
  const [hakusana, setHakusana] = useState('');


 /*  Marker päivittyy tässä tapauksessa vasta haettaessa toista kertaa, epäilen siksi että sen arvoja asetetaan tilamuuttujasta
     jota on vasta samalla ajolla päivitetty. Async-await syntaksilla tuon kirjoittaminen nopeammin päivittyvään
     muotoon oli luontevampaa, joten päädyin käyttämään sitä. Eipä tässä kai varsinaisesti markerin käyttöä vaadittukkaan, mutta
     kivempi näin.

  const haePaikka = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=agoIggMsQvpR1Fz9FrjGAIoHLfwKGt4G&location=${hakusana}`)
    .then(response => response.json())
    .then(responseJson => setKoordinaatit({latitude:responseJson.results[0].locations[0].latLng.lat, 
                                            longitude: responseJson.results[0].locations[0].latLng.lng,
                                            latitudeDelta: 0.0322, longitudeDelta: 0.0221 }))
    .catch(error => { 
        Alert.alert('Error', error.toString()); 
    });
    setMarker({latitude: koordinaatit.latitude, longitude: koordinaatit.longitude})
  } */

   const haePaikka = async () => {
    try{
      const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=agoIggMsQvpR1Fz9FrjGAIoHLfwKGt4G&location=${hakusana}`);
      const data = await response.json();

      /* muutetaan vastauksena saadun objektin tiedot tarvittavaan muotoon */
      let koordinaatti = {latitude: data.results[0].locations[0].latLng.lat,
        longitude: data.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322, longitudeDelta: 0.0221}
  
      setKoordinaatit(koordinaatti)
      setMarker({latitude: koordinaatti.latitude, longitude: koordinaatti.longitude})
      /* tälle Markerille olisi voinut tuota data objektiakin käyttää arvojen asettamiseen, mutta käytin koordinaatti-objektia kun se kerran
        jo oli olemassa ja näyttää siistimmältä näin */

    } catch (error) {
      console.error(error)
    }
  } 


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={koordinaatit}>
        <Marker 
          coordinate={marker}
          title={hakusana}
        /> 
      </MapView>
      <TextInput placeholder='Hae paikkaa'  onChangeText={input => setHakusana(input)}/>
      <Button title='Hae' onPress={haePaikka}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});
