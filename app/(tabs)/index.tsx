import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../constants/supabase';

export default function HomeScreen() {
  const [selectedPet, setSelectedPet] = useState<'cat' | 'dog' | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!selectedPet) return;
    setLoading(true);

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      router.replace('/(upload)/upload-photo');
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>
      <Text style={styles.subtitle}>
        Understand your pet’s feelings through the magic of AI
      </Text>

      <Text style={styles.chooseText}>Choose your pet</Text>

      <View style={styles.petButtons}>
        <TouchableOpacity
          style={[
            styles.petButton,
            selectedPet === 'cat' && styles.activePetButton,
          ]}
          onPress={() => setSelectedPet('cat')}
        >
          <Text style={styles.petIcon}>🐱</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.petButton,
            selectedPet === 'dog' && styles.activePetButton,
          ]}
          onPress={() => setSelectedPet('dog')}
        >
          <Text style={styles.petIcon}>🐶</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.startButton, !selectedPet && styles.disabledButton]}
        onPress={handleStart}
        disabled={!selectedPet || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.startButtonText}>Let's Go!</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffcdd5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
    maxWidth: 300,
  },
  chooseText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    color: '#444',
  },
  petButtons: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 30,
  },
  petButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  activePetButton: {
    backgroundColor: '#f48496',
  },
  petIcon: {
    fontSize: 28,
  },
  startButton: {
    backgroundColor: '#f48496',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  disabledButton: {
    backgroundColor: '#f9aab5',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
