import 'react-native-gesture-handler';
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { database } from './config/firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { UserContext } from './config/StateContext';



export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [heure, setHeure] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const { user } = useContext(UserContext);


  if (!user) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chargement des données utilisateur...</Text>
        </View>
    );
 }

  const handleSave = async () => {
    if (taskName && description && date && heure) {
        const formattedDate = moment(date).format('DD-MM-YYYY');
        const formattedTime = moment(heure).format('HH:mm');
      try {
        const docRef =database.ref(`taches/${user.id}`).push();
        const taskId = docRef.key;
        const task = {id:taskId,
           taskName, 
           description,
           finish:false, 
           date: formattedDate,
           heure: formattedTime};

        await docRef.set(task);

        Alert.alert('Success', 'tache ajoutée avec success!');
        setTaskName('');
        setDescription('');
        setDate(new Date());
        setHeure(new Date());
      } catch (error) {
        console.error('Error saving task to Firestore:', error);
        Alert.alert('Error', 'Failed to save task: ' + error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    setHeure(prevDate => {
      const newDate = moment(prevDate).set({
        hour: moment(selectedTime).hour(),
        minute: moment(selectedTime).minute(),
      }).toDate();
      return newDate;
    });
    hideTimePicker();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.inputext}>Nom de la tache :</Text>
      <TextInput
        style={styles.input}
        placeholder="planification"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Text style={styles.inputext}>Description:</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Description de la tache"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.dateTimeContainer}>
    <View style={styles.dateTimeColumn}>
      <Text style={styles.dateTimeLabel}>Date</Text>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateTimeButton}>
        <Text style={styles.dateText}>{moment(date).format('DD-MM-YYYY')}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.dateTimeColumn}>
      <Text style={styles.dateTimeLabel}>Heure</Text>
      <TouchableOpacity onPress={showTimePicker} style={styles.dateTimeButton}>
        <Text style={styles.dateText}>{moment(heure).format('HH:mm')}</Text>
      </TouchableOpacity>
    </View>
  </View>

  <DateTimePickerModal
    isVisible={isDatePickerVisible}
    mode="date"
    onConfirm={handleConfirmDate}
    onCancel={hideDatePicker}
    date={date}
  />
  <DateTimePickerModal
    isVisible={isTimePickerVisible}
    mode="time"
    onConfirm={handleConfirmTime}
    onCancel={hideTimePicker}
    date={heure}
  />

      <TouchableOpacity onPress={handleSave} style={styles.btn}>
        <Text style={styles.btnText}>Enregistrer la tache</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputext: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dateTimeColumn: {
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionInput: {
    width: '100%',
    height: 140,
    backgroundColor: '#DDDDDD',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical:'top'
  },
  dateTimeButton: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems:'center',
    borderRadius: 5,
    marginTop: 20,
    marginStart:15,
    marginEnd:15,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
