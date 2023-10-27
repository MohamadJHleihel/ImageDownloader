import React, { useState, useEffect } from 'react';
import { View, Image, Button, Alert, TextInput, FlatList } from 'react-native';
//import * as ImagePicker from 'expo-image-picker'; 
import * as MediaLibrary from 'expo-media-library'; 
import axios from 'axios';

export default function ImageDownloader() {
  const [image, setImage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const downloadImage = async (uri) => {
    if (await requestPermission()) {
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        Alert.alert('Image downloaded', 'Image has been saved to your gallery!');
      } catch (error) {
        console.error('Error saving image:', error);
        Alert.alert('Error', 'Failed to download the image.');
      }
    } else {
      Alert.alert('Permission required', 'You need to grant permissions to save the image.');
    }
  };

/*   useEffect(() => {
    if (searchText) {
      // Make an API request based on searchText
      axios.get(`https://pixabay.com/api/?key=40306185-9d3aa022bada519d0308e2cd8&query=${searchText}`)
        .then((response) => {
          setSearchResults(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error fetching images:', error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchText]);
 */
  useEffect(() => {
    if (searchText) {
      fetch("https://pixabay.com/api/?key=40306185-9d3aa022bada519d0308e2cd8&q="+searchText+"&image_type=photo&pretty=true")
        .then(response => response.json())
        .then(json => {
          console.log(json);})
    }});
  return (
    <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',marginTop:50}}>
      <TextInput
        placeholder="Search for images"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.webformatURL }} style={{ width: 300, height: 300 }} />
            <Button
              title="Download Image"
              onPress={() => downloadImage(item.url)}
            />
          </View>
        )}
      />
    </View>
  );
}
