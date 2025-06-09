// File: app/(upload)/upload.tsx
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Please enable gallery access in settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Please enable camera access in settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Please select or take a photo first.');
      return;
    }
    // 將圖片參數一起傳到 reading 頁
    router.push({ pathname: '/(upload)/reading', params: { image: imageUri } });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a photo</Text>
      <Text style={styles.subtitle}>Let’s see your furry friend!</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>Your pet’s photo will appear here{"\n"}Choose from gallery or take a new photo</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Ionicons name="image" size={20} color="white" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEDBFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    color: '#555',
    marginBottom: 20,
  },
  imageBox: {
    backgroundColor: '#F8F2FF',
    borderRadius: 20,
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagePlaceholderText: {
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#7C4DFF',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#B174DC',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
