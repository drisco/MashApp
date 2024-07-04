// Dans HomeScreen.js ou HomeScreen.tsx
import 'react-native-gesture-handler';
import { UserContext } from './config/StateContext';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';

export default function HomeScreen() {

  const { user } = useContext(UserContext);
  const navigation = useNavigation();

    if (!user) {
      return (
          <View style={styles.container}>
              <Text style={styles.title}>Chargement des données utilisateur...</Text>
          </View>
      );
   }  

  return (
    
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.block} onPress={() => navigation.navigate('Ajouter')}>
        <Text style={styles.blockText}>Ajouter un Utilisateur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.block} onPress={() => navigation.navigate('Liste des utilisateurs')}>
        <Text style={styles.blockText}>Liste des Utilisateurs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.block} onPress={() => navigation.navigate('WebPage')}>
        <Text style={styles.blockText}>Page Web</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.block} onPress={() => navigation.navigate('Historique')}>
        <Text style={styles.blockText}>Historique</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  block: {
    width: 300,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  blockText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

