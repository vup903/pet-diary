// File: app/(upload)/reading.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const RADIUS = 70;
const STROKE_WIDTH = 12;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;


export default function ReadingScreen() {
  const { image } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            router.push({ pathname: '/(upload)/result', params: { image } });
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading Emotion...</Text>

      <View style={styles.svgWrapper}>
        <Svg width={160} height={160}>
          <Circle
            cx="80"
            cy="80"
            r={RADIUS}
            stroke="#EAD6FD"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx="80"
            cy="80"
            r={RADIUS}
            stroke="#A56AE2"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${CIRCLE_LENGTH}, ${CIRCLE_LENGTH}`}
            strokeDashoffset={CIRCLE_LENGTH - (CIRCLE_LENGTH * progress) / 100}
            strokeLinecap="round"
            rotation="-90"
            origin="80,80"
            fill="none"
          />
        </Svg>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      <Text style={styles.subtitle}>
        Our AI is understanding{'\n'}your pet’s feelings
      </Text>
      <View style={styles.pawsRow}>
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.paw}>🐾</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD6FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  svgWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    position: 'absolute',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    marginBottom: 32,
  },
  pawsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paw: {
    fontSize: 24,
  },
});
