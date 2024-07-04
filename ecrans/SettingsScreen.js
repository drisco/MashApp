// Dans SettingsScreen.js ou SettingsScreen.tsx
import 'react-native-gesture-handler';
import {React,useState,useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import { UserContext } from './config/StateContext';



export default function SettingsScreen({setIsLoggedIn}) {

  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const {logout } = useContext(UserContext);
  const navigation = useNavigation();

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };

  const showPopover = (ref) => {
    setPopoverAnchor(ref);
    setPopoverVisible(true);
  };

  const closePopover = () => {
    setPopoverVisible(false);
  };

  const handleLogout = async () => {
    await logout();
    setPopoverVisible(false);
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconLeft} onPress={() => navigation.navigate('HomePage')}>
            <Ionicons name="chevron-back-outline" size={25} color="white" />
          </TouchableOpacity>
          <Text style={styles.titre}>Parametre</Text>
          <TouchableOpacity style={styles.iconRight} onPress={(event) => showPopover(event.nativeEvent.target)}>
            <Ionicons name="ellipsis-vertical-sharp" size={25} color="white" />
          </TouchableOpacity>
        </View>

        <Popover
        isVisible={isPopoverVisible}
        fromView={popoverAnchor}
        onClose={closePopover}
        arrowStyle={{ backgroundColor: 'transparent' }}
        popoverStyle={styles.popoverContainer}
      >
        <TouchableOpacity style={styles.popoverItem}>
          <Text>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popoverItem} onPress={handleLogout}>
          <Text>Se déconnecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popoverItem} onPress={closePopover}>
          <Text>Annuler</Text>
        </TouchableOpacity>
        </Popover>

    </View>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
  },
  titre: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  iconRight: {
    paddingRight: 10,
  },
  popoverContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    maxWidth: 200,
  },
  popoverItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
