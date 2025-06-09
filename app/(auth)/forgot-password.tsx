import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.subtitle}>
        Enter your email and we'll send you a reset link
      </Text>

      <TextInput placeholder="Email" style={styles.input} />

      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#f48496',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
