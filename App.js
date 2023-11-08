import React, { useState, useEffect } from 'react';
import { View, Image, Button, Alert, TextInput, FlatList } from 'react-native';
//import * as ImagePicker from 'expo-image-picker'; 
import * as MediaLibrary from 'expo-media-library'; 
import axios from 'axios';
import * as FileSystem from 'expo-file-system';


export default function ImageDownloader() {
  const [image, setImage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [numItemsToShow, setNumItemsToShow] = useState(10);
  const resetSearch = () => {
    setSearchText(''); // Clear the search text
    setSearchResults([]);}; // Clear the search results

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

/*   const downloadImage = async (uri) => {
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
  }; */
  const safeSearch = true; 


 /*  const saveImageToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        // Download the image to the app’s cache directory
        const fileUri = `${FileSystem.cacheDirectory}image.jpg`;
        await FileSystem.downloadAsync(url, fileUri);
        // Save the downloaded image to the media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const albumName = 'MyImages';
        const album = await MediaLibrary.getAlbumAsync(albumName);
        if (album === null) {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        alert('Image saved to gallery successfully!');
      } else {
        alert('Permission to access media library denied.');
      }
    } catch (error) {
      console.error('Error saving image: ', error);
    }
  }; */

  const saveImageToGallery = async (url) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        // Download the image to the app’s cache directory
        const fileUri = `${FileSystem.cacheDirectory}image.jpg`;
        await FileSystem.downloadAsync(url, fileUri); // Pass the URL here
        // Save the downloaded image to the media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const albumName = 'MyImages';
        const album = await MediaLibrary.getAlbumAsync(albumName);
        if (album === null) {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        alert('Image saved to gallery successfully!');
      } else {
        alert('Permission to access media library denied.');
      }
    } catch (error) {
      console.error('Error saving image: ', error);
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
      fetch("https://pixabay.com/api/?key=40306185-9d3aa022bada519d0308e2cd8&q="+searchText+"&image_type=photo&pretty=true&callback&safsearch="+safeSearch)
        .then(response => response.json())
        .then(json => {
          setSearchResults(json.hits);
          
    });}},[searchText]);

    
  return (
    <View style={{alignContent:'center',alignItems:'center',justifyContent:'center',marginTop:100}}>
      <TextInput
        placeholder="Search for images"
        value={searchText}
        onChangeText={setSearchText}
      />
          <Button
        title="Load More"
        onPress={() => setNumItemsToShow(numItemsToShow + 10)} // Adjust the increment as needed
      />
       <Button
        title="Reset"
        onPress={resetSearch} // Call the reset function
      />
      <FlatList
        data={searchResults.slice(0, numItemsToShow)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.previewURL }} style={{ width: 200, height: 200 ,borderRadius:20}} />
            <Button
              title="Download Image"
              onPress={() => saveImageToGallery(item.largeImageURL) }
            />
          </View>
        )}
      />
        
    </View>
  );
}
