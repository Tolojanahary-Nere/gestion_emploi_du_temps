import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

// Define styles for the component
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
    width: '100%',
    backgroundColor: '#eaeaea',
    marginVertical: 15,
    borderRadius: 3,
    paddingHorizontal: 15,
    height: 65,
    justifyContent: 'center',
  },
  input: {
    width: '100%',
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
  // Define state with appropriate types
  const [nom, setNom] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState<'connecter' | 'nouveau' | null>(null);

  // Handle button clicks to set the selected button state
  const handleConnecterBtnClick = () => {
    setSelectedButton('connecter');
  };

  const handleNouveauBtnClick = () => {
    setSelectedButton('nouveau');
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('nom:', nom);
    console.log('email:', email);
    console.log('Mot de passe:', motDePasse);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Se connecter</Text>
        <View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={nom}
              onChangeText={setNom}
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={motDePasse}
              onChangeText={setMotDePasse}
              secureTextEntry
            />
          </View>
          <Text>Mot de passe oublié <Text style={{ color: '#3c00a0' }}>Cliquez ici!</Text></Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: selectedButton === 'connecter' ? '#fff' : '#3c00a0', borderColor: selectedButton === 'connecter' ? '#3c00a0' : 'transparent' }]}
            onPress={handleConnecterBtnClick}
          >
            <Text style={[styles.buttonText, { color: selectedButton === 'connecter' ? '#3c00a0' : '#fff' }]}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: selectedButton === 'nouveau' ? '#fff' : '#3c00a0', borderColor: selectedButton === 'nouveau' ? '#3c00a0' : 'transparent' }]}
            onPress={handleNouveauBtnClick}
          >
            <Text style={[styles.buttonText, { color: selectedButton === 'nouveau' ? '#3c00a0' : '#fff' }]}>Nouveau compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Authentification;
