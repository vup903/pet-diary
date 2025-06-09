// app/(upload)/result.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ResultScreen() {
  const router = useRouter();
  const { image } = useLocalSearchParams(); // 接收從 upload 傳來的圖片參數
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // 淡入動畫
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // 成功 bounce 動畫
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(bounceAnim, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setShowConfetti(true);
  }, []);

  const handleGenerate = () => {
    // router.push('/(diary)/diary');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {showConfetti && <ConfettiCannon count={60} origin={{ x: 160, y: -10 }} fadeOut fallSpeed={3000} />}

      <Animated.Text style={[styles.title, { transform: [{ scale: bounceAnim }] }]}>Emotion Detected!</Animated.Text>

      <View style={styles.resultBox}>
        <Image
          source={image ? { uri: image.toString() } : require('@/assets/images/default-cat.png')}
          style={styles.petImage}
        />
        <Text style={styles.emotion}>Grumpy</Text>
        <Text style={styles.confidence}>Confidence: 80%</Text>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateText}>Generate Diary</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFC9D7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  resultBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  emotion: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confidence: {
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#F47190',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  generateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
