import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function DiaryResultScreen() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration] = useState(30);
  const [modalVisible, setModalVisible] = useState(false);
  const [diaryText, setDiaryText] = useState(
    `Today, the grumpiness in my heart is clear for all to see. It’s best to stay out of my way, unless you have some particularly tasty treats to offer!`
  );
  const [isEditing, setIsEditing] = useState(false);
  const emotion = 'Grumpy';
  const mockAudioUri = 'https://example.com/fake-audio.mp3';
  const inputRef = useRef<TextInput>(null);

  const handleSaveText = () => {
    setIsSaved(true);
    setIsEditing(false);
    setAudioReady(false);
    Keyboard.dismiss();
  };

  const handleGenerateAudio = () => {
    if (!isSaved) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAudioReady(true);
    }, 2000);
  };

  const handleRetry = () => {
    setDiaryText(`(New AI generated content goes here...)`);
    setIsSaved(false);
    setAudioReady(false);
  };

  const handleFinalSave = () => {
    const dataToSave = {
      imageUri,
      emotion,
      diaryText,
      audioUri: mockAudioUri,
    };
    console.log('Saving to DB:', dataToSave);
    Alert.alert('Saved!', 'Your pet diary has been saved.');
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const goHome = () => {
    router.push('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: imageUri as string }} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.petName}>{emotion}</Text>

          <View style={styles.diaryBox}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              {isEditing ? (
                <TextInput
                  ref={inputRef}
                  multiline
                  value={diaryText}
                  onChangeText={setDiaryText}
                  style={styles.diaryTextEditable}
                  textAlignVertical="top"
                  scrollEnabled
                />
              ) : (
                <Text style={styles.diaryText}>{diaryText}</Text>
              )}
            </ScrollView>

            <View style={styles.iconButtonRow}>
              <TouchableOpacity onPress={startEditing}>
                <Feather name="edit-3" size={22} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRetry}>
                <Feather name="rotate-ccw" size={22} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveText}>
                <Feather name="check" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {!audioReady ? (
            isGenerating ? (
              <View style={styles.audioButton}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.audioText}> Generating Audio...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.audioButton, !isSaved && styles.disabledButton]}
                disabled={!isSaved}
                onPress={handleGenerateAudio}
              >
                <Feather name="volume-2" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.audioText}>Generate Audio</Text>
              </TouchableOpacity>
            )
          ) : (
            <>
              <View style={styles.audioPlayer}>
                <View style={styles.sliderRow}>
                  <Text style={styles.timeText}>
                    {Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, '0')}
                  </Text>

                  <Slider
                    style={{ flex: 1, marginHorizontal: 10 }}
                    minimumValue={0}
                    maximumValue={duration}
                    value={progress}
                    onValueChange={val => setProgress(Math.floor(val))}
                    minimumTrackTintColor="#7d57c7"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#7d57c7"
                  />

                  <Text style={styles.timeText}>
                    {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
                  </Text>
                </View>

                <View style={styles.audioControls}>
                  <TouchableOpacity onPress={() => setProgress(Math.max(progress - 5, 0))}>
                    <Feather name="rewind" size={26} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                    <Feather name={isPlaying ? 'pause' : 'play'} size={26} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setProgress(Math.min(progress + 5, duration))}>
                    <Feather name="fast-forward" size={26} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.finalSaveButton} onPress={handleFinalSave}>
                  <Feather name="save" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.finalSaveText}>Save</Text>
                </TouchableOpacity>

                {/* 裸 Home icon */}
                <Feather name="home" size={24} color="#7d57c7" onPress={goHome} />
              </View>
            </>
          )}

          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalBackground}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseArea} />
              <Image source={{ uri: imageUri as string }} style={styles.fullImage} />
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffcdd5',
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  diaryBox: {
    backgroundColor: 'white',
    width: '90%',
    height: 220,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  diaryText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  diaryTextEditable: {
    fontSize: 15,
    color: '#333',
    minHeight: 200,
  },
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  audioButton: {
    backgroundColor: '#f48496',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#fbbac3',
    opacity: 0.5,
  },
  audioText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  audioPlayer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    width: 40,
    textAlign: 'center',
    color: '#333',
  },
  audioControls: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
  },
  bottomButtons: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  finalSaveButton: {
    backgroundColor: '#7d57c7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  finalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
