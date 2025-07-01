// File: app/(upload)/upload.tsx
import { supabase } from '@/constants/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log('[Upload] Checking session...');
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log('[Upload] Session data:', session);
      if (!session) {
        router.replace('/login');
        return;
      }
      setUserId(session.user.id);
      setSessionChecked(true);
    })();
  }, []);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('[Upload] Media permissions granted:', granted);
    if (!granted) return Alert.alert('Permission denied', '請允許存取相簿');
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log('[Upload] Pick result:', res);
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('[Upload] Camera permissions granted:', granted);
    if (!granted) return Alert.alert('Permission denied', '請允許使用相機');
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log('[Upload] Camera result:', res);
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const handleUpload = async () => {
    console.log('[Upload] Start upload, imageUri:', imageUri, 'userId:', userId);
    if (!imageUri) return Alert.alert('No image selected', '請選擇或拍照一張寵物照片');
    if (!userId) return Alert.alert('Not logged in', '請重新登入');
    setUploading(true);

    try {
      const fileName = `${Date.now()}.jpg`;
      console.log('[Upload] FileName:', fileName);

      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      console.log('[Upload] Base64 size:', base64.length);

      const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      console.log('[Upload] Binary length:', binary.length);

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, binary, { contentType: 'image/jpeg' });
      console.log('[Upload] Storage uploadError:', uploadError);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('pet-photos').getPublicUrl(fileName);
      console.log('[Upload] Public URL data:', data);
      const publicUrl = data.publicUrl;
      console.log('[Upload] publicUrl:', publicUrl);

      const { error: dbError } = await supabase
        .from('photos')
        .insert([{ image_url: publicUrl, user_id: userId }]);
      console.log('[Upload] DB insert error:', dbError);
      if (dbError) throw dbError;

      console.log('[Upload] Calling backend analyze', publicUrl);
      const res = await fetch('https://your-backend.com/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });
      console.log('[Upload] Backend status:', res.status);
      if (!res.ok) throw new Error('Analysis failed');
      const result = await res.json();
      console.log('[Upload] Analysis result:', result);

      router.push({
        pathname: '/(upload)/reading',
        params: { image: publicUrl, analysis: JSON.stringify(result) },
      });
    } catch (err: any) {
      console.error('[Upload] Error caught:', err);
      Alert.alert('Upload Error', err?.message ?? err);
    } finally {
      setUploading(false);
    }
  };

  if (!sessionChecked) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a photo</Text>
      <Text style={styles.subtitle}>Let’s see your furry friend!</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>
            Your pet’s photo will appear here{'\n'}Choose from gallery or take a new photo
          </Text>
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

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Upload</Text>}
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
    height: 380,
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
