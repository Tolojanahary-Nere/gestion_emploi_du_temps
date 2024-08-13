import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,50,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: '#fff',
    padding: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#3c00a0',
    marginBottom: 15,
  },
  inputField: {
    backgroundColor: '#eaeaea',
    marginVertical: 15,
    borderRadius: 3,
    paddingHorizontal: 15,
    height: 65,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#3c00a0',
    color: '#fff',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

function Authentification() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>(); // Utilisation de 'any' pour contourner le problème de typage

  const handleConnecterBtnClick = async () => {
    const user = {
      username,
      password,
    };

    try {
      const response = await fetch('http://10.0.2.2:8000/api/Gestedt/authenticate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('User connected:', data);
        navigation.navigate('Salle'); // Redirection vers l'écran d'accueil
      } else {
        Alert.alert('Erreur', 'Nom d\'utilisateur ou mot de passe incorrect');
        console.log('Erreur', 'Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Bonjour</Text>
        <View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <Text>Mot de passe oublié ?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConnecterBtnClick}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Authentification;
