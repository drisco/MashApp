import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, TouchableWithoutFeedback } from 'react-native';
import { database } from './config/firebase';
import { UserContext } from './config/StateContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';

export default function UserListScreen() {
  const [tasks, setTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(UserContext);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const modalizeRef = useRef(null);
  const [longPressing, setLongPressing] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filter, setFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();


  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement des données utilisateur...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (user) {
      const tasksRef = database.ref(`taches/${user.id}`);
      tasksRef.on('value', (snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          const tasksArray = Object.keys(tasksData).map(key => ({
            ...tasksData[key],
            id: key,
          }));
          setTasks(tasksArray);
          applyFilter(filter, tasksArray, searchTerm);
        }
      });

      return () => tasksRef.off();
    }
  }, [user, filter, searchTerm]);

  const applyFilter = (filter, tasks, search) => {
    let filteredTasks;
    if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
      if (filteredTasks.length === 0) {
        Alert.alert('Info', 'Pas de tâche terminée');
      }else{
        setTasks(filteredTasks);
      }
    } else if (filter === 'notCompleted') {
      filteredTasks = tasks.filter(task => !task.completed);
      if (filteredTasks.length === 0) {
        Alert.alert('Info', 'Pas de tâche non terminée');
      }else{
        setTasks(filteredTasks);
      }
    } else {
      filteredTasks = tasks;
    }
    if (search.trim() !== '') {
      const searchTermLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.taskName.toLowerCase().includes(searchTermLower) ||
        task.date.toLowerCase().includes(searchTermLower)
      );
      if (filteredTasks.length===0) {
        Alert.alert('Message', 'Aucun resultat trouvé');
      }else{
        setTasks(filteredTasks);
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilter(filter, tasks, term);
  };

  const handleToggleTaskCompletion = async (taskId, completed) => {
    try {
      const taskRef = database.ref(`taches/${user.id}/${taskId}`);
      await taskRef.update({ completed: completed });
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: completed };
        }
        return task;
      }));
      applyFilter(filter, tasks, searchTerm);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task: ' + error.message);
    }
  };
  

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Supprission de la tache ',
      'Voulez vous vraiment supprimer cette tache?',
      [
        {
          text: 'Anuler',
          style: 'cancel',
        
        },
        {
          text: 'Supprimer',
          onPress: () => {
            const taskRef = database.ref(`taches/${user.id}/${taskId}`);
            taskRef.remove()
              .then(() => Alert.alert('Success', 'Task deleted successfully'))
              .catch((error) => Alert.alert('Error', 'Failed to delete task: ' + error.message));
          },
          style: 'destructive',
        },
      ],
    );
    setLongPressing(false);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    modalizeRef.current?.open();
  };

  const updateTask = async (task) => {
    try {
      const taskRef = database.ref(`taches/${user.id}/${task.id}`);
      await taskRef.set(task);
      setLongPressing(false);
      Alert.alert('Succès', 'Votre modification à été éffectuée avec succès!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update task: ' + error.message);
    }
  };

  const handleToggleDescription = (taskId) => {
    setExpandedTaskId(prevTaskId => (prevTaskId === taskId ? null : taskId));
  };

  const renderDescription = (description, taskId) => {
    if (expandedTaskId === taskId) {
      return description;
    }
    return description.length > 30 ? `${description.substring(0, 30)}...` : description;
  };

  const handleLongPressIn = () => {
    setLongPressing(true);
  };

  const handlePressOut = () => {
    setLongPressing(false);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter, tasks, searchTerm);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Recherche par nom de tâche ou date"
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.iconRight} onPress={() => { setIsLoggedIn(false); setSearchTerm(''); }}>
          <Ionicons name="close-sharp" size={25} color="white" />
        </TouchableOpacity>
      </View>
      ):(
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconLeft} onPress={() => navigation.navigate('HomePage')}>
            <Ionicons name="arrow-back-outline" size={25} color="white" />
          </TouchableOpacity>
          <Text style={styles.titre}>Liste des taches</Text>
          <TouchableOpacity style={styles.iconRight} onPress={(event) => setIsLoggedIn(true)}>
            <Ionicons name="search-sharp" size={25} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.containerStatut}>
        <TouchableOpacity onPress={() => handleFilterChange('notCompleted')}>
        <Text style={styles.statutText1}>Non terminée</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('completed')}>
        <Text style={styles.statutText}>terminée</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onLongPress={handleLongPressIn}
            //onPressOut={handlePressOut}
          >
            <View style={styles.userItem}>
              {/* Ajouter la checkbox ici */}
            <View style={styles.rowContainer1}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleToggleTaskCompletion(item.id, !item.completed)}
              >
                {item.completed ? (
                  <Ionicons name="checkbox-outline" size={24} color="green" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="white" />
                )}
              </TouchableOpacity>
              <Text style={styles.label}>{item.taskName}</Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleDescription(item.id)} style={styles.descriptionContainer}>
              <Text style={styles.labeldesc}>{renderDescription(item.description, item.id)}</Text>
            </TouchableOpacity>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeRow1}>
                <Text style={styles.labeldate}>Date:</Text>
                <Text style={styles.text}>{item.date}</Text>
              </View>
              <View style={styles.dateTimeRow1}>
                <Text style={styles.labeldate}>Heure:</Text>
                <Text style={styles.text}>{item.heure}</Text>
              </View>
            </View>
            {longPressing && (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.icon}>
                  <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.icon}>
                  <Ionicons name="create-outline" size={24} color="green" />
                </TouchableOpacity>
              </View>
            )}
            
          </View>
          </TouchableWithoutFeedback>
          
        )}
      />
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Edit Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={selectedTask ? selectedTask.taskName : ''}
            onChangeText={(text) => setSelectedTask({ ...selectedTask, taskName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={selectedTask ? selectedTask.description : ''}
            onChangeText={(text) => setSelectedTask({ ...selectedTask, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={selectedTask ? selectedTask.date : ''}
            onChangeText={(text) => setSelectedTask({ ...selectedTask, date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Heure"
            value={selectedTask ? selectedTask.heure : ''}
            onChangeText={(text) => setSelectedTask({ ...selectedTask, heure: text })}
          />
          <TouchableOpacity onPress={() => { updateTask(selectedTask); modalizeRef.current?.close(); }} style={styles.modalButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    height: 60,
    width: '100%',
  },
  iconRight: {
    paddingRight: 10,
  },
  text:{
    color: 'white'
  },
  searchContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 2,
    marginEnd:10,
    backgroundColor:'white'
  },
  titre: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    fontSize: 16,
    height:40,
  },
  userItem: {
    padding: 10,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  rowContainer1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop:10,
    marginStart:1,
  },
  containerStatut:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:5,
    margin:10,
  },
  statutText: {
    width:150,
    fontSize:16,
    backgroundColor:'green',
    padding:10,
    borderRadius:15,
    textAlign:'center',
    color:'white',
  },
  statutText1: {
    width:150,
    fontSize:16,
    backgroundColor:'orange',
    padding:10,
    borderRadius:15,
    textAlign:'center',
    color:'white',
  },
  rowContainerDesc: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin:10,
  },
  descriptionContainer: {
    flex: 1,
    marginBottom: 10,
    marginStart:35,
  },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginStart:15,
  },
  dateTimeRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  column: {
    width: '40%', // Ajustez selon votre mise en page
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
  labeldate: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize:12
  },
  labeldesc: {
    color: 'grey',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize:12,
  },
  text: {
    color: 'white',
    fontSize:12
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    marginLeft: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },  
});