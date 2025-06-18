import AsyncStorage from '@react-native-async-storage/async-storage'
import CheckBox from '@react-native-community/checkbox'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../constants/supabase'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const checkRememberedUser = async () => {
      const remembered = await AsyncStorage.getItem('rememberMe')
      const { data } = await supabase.auth.getSession()
      if (remembered === 'true' && data.session) {
        router.replace('/home')
      }
    }
    checkRememberedUser()
  }, [])

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password')
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      Alert.alert('Login failed', error.message)
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true')
      } else {
        await AsyncStorage.removeItem('rememberMe')
      }
      router.replace('/home')
    }
  }

  const handleFacebookSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: 'yourapp://login-callback' }
    })
    if (error) Alert.alert('Facebook login error', error.message)
  }

  const handlePhoneSignIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: email  // 使用電話號碼欄位，實際可設為另一個欄位
    })
    if (error) Alert.alert('Phone login error', error.message)
    else Alert.alert('Check your phone', 'OTP code sent via SMS')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>

      <TextInput
        placeholder="Email or Phone"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password (for email login)"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.checkboxRow}>
        <CheckBox value={rememberMe} onValueChange={setRememberMe} />
        <Text>Remember me</Text>
      </View>

      <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signIn} onPress={handlePhoneSignIn}>
        <Text style={styles.signInText}>Sign In with Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebook} onPress={handleFacebookSignIn}>
        <Text style={styles.signInText}>Sign In with Facebook</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.signUp} onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
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
    marginBottom: 12,
  },
  facebook: {
    backgroundColor: '#3b5998',
    borderRadius: 20,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
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
})
