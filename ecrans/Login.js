import React, { useState,useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Image,Alert, Modal, ActivityIndicator } from 'react-native';
import {signIn } from './config/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './config/firebase';
import { UserContext } from './config/StateContext';


export default function Login({setIsLoggedIn}) {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const navigation = useNavigation();
  const {user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setIsLoggedIn(true);
          
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session utilisateur', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);



  const handleSignUp = async () => {
    setIsLoading(true);
    try {
        const uid = await signIn(email, mdp);

        const tachesRef = database.ref(`users/${uid}`);
        const snapshot = await tachesRef.once('value');
        const userData = snapshot.val();
        
        if (snapshot.exists) {
            
            setIsLoggedIn(true);
            setUser(userData);
        } else {
            console.log("Données utilisateur non trouvées.");
            Alert.alert('Erreur', 'Données utilisateur non trouvées');
        }
    } catch (error) {
        console.error('Erreur de connexion :', error);
        Alert.alert('Erreur', 'Échec de la connexion. Veuillez vérifier vos informations.');
    }
    finally {
      setIsLoading(false); // Masquer le modal de chargement
    }
};


  const pageRegister = async () => {
    setIsLoggedIn(false);
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="none"
        visible={isLoading}
        onRequestClose={() => { }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />
          </View>
        </View>
      </Modal>
      
      <View style={styles.imagecontain}>
        <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
        />
        <Text style={styles.title}>Connexion</Text>
      </View>

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder='john@gmail.com'
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={mdp}
        placeholder='°°°°°°°°°°°°°°°°'
        onChangeText={setMdp}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.btnText}>Se connecter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.buttonother}
        onPress={pageRegister}
      >
        <Ionicons name="logo-google" size={20} color="black" />
        <Text style={styles.buttonText}>Creer un compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonother}
      >
        <Ionicons name="logo-github" size={20} color="black" />
        <Text style={styles.buttonText}>Se connecter avec GitHub</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  imagecontain: {
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,

  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight:'900',
  },

  buttonother: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});