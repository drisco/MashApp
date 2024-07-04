import React, { useContext,useEffect } from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/database'; 
import { Alert } from 'react-native';
// import { UserContext } from './StateContext';

export const firestore = firebase.firestore();
export const database = firebase.database();
export const usersCollection = firestore.collection('users');
// Removed erroneous dataCollection definition
export const auth = firebase.auth();

// Method for sign up
const signUp = async (nom, prenom, numero, email, mdp, mdpConfirm) => {
  try {
    if (!nom || !prenom || !numero || !email || !mdp || !mdpConfirm) {
      Alert.alert('Erreur', 'Veuillez renseigner tous les champs');
      return null;
    } 

    if (mdp !== mdpConfirm) {
      Alert.alert('Erreur', 'Les mots de passe ne sont pas identiques');
      return null;
    }

    const cred = await auth.createUserWithEmailAndPassword(email, mdp);
    const { uid } = cred.user;

    // Instead of using Realtime Database collection, use Firestore collection
    //const taskRef = database.ref(`Donnees/${uid}`).push();
    const taskRef = database.ref(`users/${uid}`);

    const userData = {
      id: uid,
      nom,
      prenom,
      numero,
      email
    };

    await taskRef.set(userData);
    
    console.log('Inscription réussie, UID:', uid);
    Alert.alert('Succès', `Utilisateur créé avec UID: ${uid}`);

    return uid;

  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    Alert.alert('Echec d\'Inscription', 'Soit cette adresse est déjà liée à un compte ou le mot de passe contient moins de 6 caractères.');
    return null;
  }
};

// Method for sign in
const signIn = async (email, mdp) => {
  if (!email || !mdp) {
    Alert.alert('Erreur', 'Veuillez renseigner tous les champs');
    return Promise.reject('Champs manquants');
  }

  return auth.signInWithEmailAndPassword(email.trim(), mdp)
    .then(cred => {
      return auth.currentUser.uid;
    })
    .catch(err => {
      Alert.alert('Connexion échouée', 'Veuillez vérifier votre adresse e-mail et votre mot de passe.');
      return Promise.reject(err);
    });
};

// Method for sign out
const signAout = () => {
  return auth.signOut();
};

export { signUp, signIn, signAout };
export default firebase;
