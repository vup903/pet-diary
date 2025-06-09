import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // 這裡可加入實際驗證邏輯
    if (email && password) {
      // 假設驗證成功
      router.push('/(upload)/upload-photo');
    } else {
      Alert.alert('Missing info', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <Text>⬜ Remember me</Text>
      </View>

      <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.signUp} onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffcdd5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: '#8e44ad',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  signIn: {
    backgroundColor: '#f48496',
    borderRadius: 20,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    color: 'white',
    fontWeight: 'bold',
  },
  or: {
    marginVertical: 8,
  },
  signUp: {
    backgroundColor: '#b174dc',
    borderRadius: 20,
    padding: 14,
    width: '100%',
    alignItems: 'center',
  },
  signUpText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
