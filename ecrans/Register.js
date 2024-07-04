import React, { useState ,useContext} from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,Image,Alert } from 'react-native';
import { signUp } from './config/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from './config/StateContext';



export default function Register({navigation,setIsLoggedIn}) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numero, setNumero] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [mdpConfirm, setMdpConfirm] = useState('');
  const { setUser } = useContext(UserContext);


  const handleSignUp = async () => {
    try {
        const uid = await signUp(nom, prenom, numero, email, mdp,mdpConfirm);
        if (uid) {
            const userData = {nom,prenom,numero,email,uid};
            Alert.alert("Inscription réussie !");
            //navigation.navigate({userData});
            setUser(userData);
            setIsLoggedIn(true);

        }
          
      } catch (error) {
        Alert.alert("Erreur d'inscription", error.message);
      }
  };

  return (
    <View style={styles.container}>

      <View style={styles.imagecontain}>
        <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
        />
        <Text style={styles.title}>inscription</Text>
      </View>

      <Text>Votre Nom:</Text>
      <TextInput
        style={styles.input}
        value={nom}
        placeholder='john'
        onChangeText={setNom}
        keyboardType="text"
        autoCapitalize="none"
      />
      <Text>Votre Prenom:</Text>
      <TextInput
        style={styles.input}
        value={prenom}
        placeholder='Doe'
        onChangeText={setPrenom}
        keyboardType="text"
        autoCapitalize="none"
      />
      <Text>Votre Numéro:</Text>
      <TextInput
        style={styles.input}
        value={numero}
        placeholder='01020304'
        onChangeText={setNumero}
        keyboardType="number"
        autoCapitalize="none"
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder='john@gmail.com'
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Votre Mot de passe:</Text>
      <TextInput
        style={styles.input}
        value={mdp}
        placeholder='°°°°°°°°°°°°°°°°'
        onChangeText={setMdp}
        secureTextEntry
      />
      <Text>Confirmer Password:</Text>
      <TextInput
        style={styles.input}
        value={mdpConfirm}
        placeholder='°°°°°°°°°°°°°°°°'
        onChangeText={setMdpConfirm}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.btnText}>inscription</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.buttonother}
        onPress={() => navigation.navigate('Login')}
      >
        <Ionicons name="logo-google" size={20} color="black" />
        <Text style={styles.buttonText}>J'ai déjà un compte</Text>
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
    width: 120, // Ajustez la largeur selon vos besoins
    height: 120, // Ajustez la hauteur selon vos besoins
    marginBottom: 20, // Espace entre le logo et le reste du contenu
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
});
