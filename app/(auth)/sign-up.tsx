import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignUpScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const isPhone = emailOrPhone.startsWith('+'); // 如果是電話就用 + 開頭（E.164 格式）

  const handleSignUp = async () => {
    if (!emailOrPhone || (!isPhone && (!password || !confirmPassword))) {
      Alert.alert('Missing Info', 'Please fill out all fields');
      return;
    }

    if (!isPhone && password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    let error = null;

    if (isPhone) {
      const { error: phoneError } = await supabase.auth.signInWithOtp({
        phone: emailOrPhone,
      });
      error = phoneError;
      if (!error) {
        Alert.alert('Check SMS', 'We sent you a confirmation code');
      }
    } else {
      const { error: emailError } = await supabase.auth.signUp({
        email: emailOrPhone,
        password,
      });
      error = emailError;
      if (!error) {
        Alert.alert('Success', 'Check your email to confirm your account');
      }
    }

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      router.push('/login');
    }
  };

  const handleOAuthSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: 'exp://localhost:19000',
      },
    });

    if (error) {
      Alert.alert('Facebook Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>

      <TextInput
        placeholder="Email or Phone (+123456789)"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        placeholderTextColor="#999"
      />
      {!isPhone && (
        <>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#999"
          />
        </>
      )}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.buttonText}>
          {isPhone ? 'Sign Up with Phone' : 'Sign Up with Email'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity
        style={[styles.signUpButton, { backgroundColor: '#3b5998' }]}
        onPress={handleOAuthSignUp}
      >
        <Text style={styles.buttonText}>Sign Up with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcdd5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  signUpButton: {
    backgroundColor: '#b97cf4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  or: {
    marginVertical: 16,
  },
});
