import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Diary</Text>

      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  },
  signUpButton: {
    backgroundColor: '#b97cf4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
