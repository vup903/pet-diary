import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../constants/supabase';

WebBrowser.maybeCompleteAuthSession();

const YOUR_SUPABASE_REF = 'xkesystyxarmnulkngye';
const YOUR_SUPABASE_CLIENT_ID = '714529884870113'; // 替換為你的 client ID

const discovery = {
  authorizationEndpoint: `https://${YOUR_SUPABASE_REF}.supabase.co/auth/v1/authorize`,
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'petdiary' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: YOUR_SUPABASE_CLIENT_ID,
      redirectUri,
      scopes: ['email', 'openid'],
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

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

  useEffect(() => {
    const exchangeCode = async () => {
      if (response?.type === 'success' && response.params.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(response.params.code);
        if (error) {
          Alert.alert('OAuth Error', error.message);
        } else {
          router.replace('/home');
        }
      }
    };
    exchangeCode();
  }, [response]);

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

  const handlePhoneLogin = async () => {
    if (!email.startsWith('+')) {
      Alert.alert('Invalid Phone', 'Phone must be in +123 format');
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

      <TouchableOpacity style={styles.signInFacebook} onPress={() => promptAsync()}>
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
    color: '#000',
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
