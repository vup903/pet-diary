import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../constants/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const checkRememberedUser = async () => {
      const remembered = await AsyncStorage.getItem('rememberMe');
      const session = await supabase.auth.getSession();
      if (remembered === 'true' && session.data.session) {
        router.replace('/home');
      }
    };
    checkRememberedUser();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }
      router.replace('/home');
    }
  };

  const handleOAuthLogin = async (provider: 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'exp://localhost:19000', // ✅ Expo redirect URI
      },
    });

    if (error) Alert.alert('OAuth Login failed', error.message);
  };

  const handlePhoneLogin = async () => {
    if (!email) {
      Alert.alert('Enter phone number (in E.164 format, e.g., +16693433823)');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: email });
    if (error) Alert.alert('SMS Login failed', error.message);
    else Alert.alert('Check your phone!', 'We sent a login code via SMS.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>

      <TextInput
        placeholder="Email or Phone"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <Checkbox value={rememberMe} onValueChange={setRememberMe} />
        <Text style={{ marginLeft: 8 }}>Remember me</Text>
      </View>

      <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInPhone} onPress={handlePhoneLogin}>
        <Text style={styles.signInText}>Sign In with Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInFacebook} onPress={() => handleOAuthLogin('facebook')}>
        <Text style={styles.signInText}>Sign In with Facebook</Text>
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
    color: '#000', // ✅ 修正輸入字為黑色
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
    marginBottom: 12,
  },
  signInPhone: {
    backgroundColor: '#f9a825',
    borderRadius: 20,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  signInFacebook: {
    backgroundColor: '#3b5998',
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
