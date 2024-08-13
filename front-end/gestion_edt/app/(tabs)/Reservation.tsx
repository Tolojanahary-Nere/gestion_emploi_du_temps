import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button,Alert } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

const Reservation: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [salle, setSalle] = useState<number | null>(null);
  const [emploiDuTemps, setEmploiDuTemps] = useState<number | null>(null); 
  const [reservations, setReservations] = useState<any[]>([]);
  const [salles, setSalles] = useState<any[]>([]);
  
  const [emploisDuTemps, setEmploisDuTemps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchReservations();
    fetchSalles();
    fetchEmploisDuTemps();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/reservations/');
      setReservations(response.data);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error(error);
    }
  };

  const fetchSalles = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/salles/');
      setSalles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
    }
  };

  const fetchEmploisDuTemps = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/emplois-du-temps/');
      setEmploisDuTemps(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois du temps:', error);
    }
  };

  const ajouterReservation = async () => {
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`http://192.168.43.238:8000/api/Gestedt/reservations/${selectedReservation.id}/`, {
          date,
          heure_debut: heureDebut,
          heure_fin: heureFin,
          salle,
          emploi_du_temps: emploiDuTemps
        });
        setAlertTitle('Succès');
        setAlertMessage('La réservation a été modifiée avec succès.');
      } else {
        await axios.post('http://192.168.43.238:8000/api/Gestedt/reservations/', {
          date,
          heure_debut: heureDebut,
          heure_fin: heureFin,
          salle,
          emploi_du_temps: emploiDuTemps
        });
        setAlertTitle('Succès');
        setAlertMessage('La réservation a été ajoutée avec succès.');
      }
      fetchReservations();
      setModalVisible(false);
      resetForm();
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la gestion de la réservation:', error);
    } finally {
      setLoading(false);
      setAlertVisible(true);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmation de suppression',
      'Êtes-vous sûr de vouloir supprimer cette réservation ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.43.238:8000/api/Gestedt/reservations/${id}/`);
              fetchReservations();
              setError(null);
              setAlertTitle('Succès');
              setAlertMessage('La réservation a été supprimée avec succès.');
            } catch (error) {
              if (axios.isAxiosError(error)) {
                setError(error.message);
              } else {
                setError('Une erreur inconnue est survenue');
              }
              console.error('Erreur lors de la suppression de la réservation:', error);
            } finally {
              setAlertVisible(true);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setDate('');
    setHeureDebut('');
    setHeureFin('');
    setSalle(null);
    setEmploiDuTemps(null);
    setSelectedReservation(null);
    setEditMode(false);
  };

  const handleDateConfirm = (date: Date) => {
    setDate(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    setDatePickerVisibility(false);
  };

  const handleStartTimeConfirm = (time: Date) => {
    setHeureDebut(time.toTimeString().split(' ')[0]); // Format time as HH:MM:SS
    setStartTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    setHeureFin(time.toTimeString().split(' ')[0]); // Format time as HH:MM:SS
    setEndTimePickerVisibility(false);
  };

  const handleEdit = (reservation: any) => {
    setSelectedReservation(reservation);
    setDate(reservation.date);
    setHeureDebut(reservation.heure_debut);
    setHeureFin(reservation.heure_fin);
    setSalle(reservation.salle.id);
    setEmploiDuTemps(reservation.emploi_du_temps.id);
    setEditMode(true);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-white rounded-lg shadow-md mb-4 p-4 w-80`}>
      <Text style={tw`text-lg font-bold`}>Salle: {item.salle.nomSalle}</Text>
      <Text style={tw`text-gray-600`}>Date: {item.date}</Text>
      <Text style={tw`text-gray-600`}>Heure: {item.heure_debut} - {item.heure_fin}</Text>
      <Text style={tw`text-gray-600`}>Emploi du Temps: {item.emploi_du_temps.jour}</Text>
      <View style={tw`flex-row justify-between mt-2`}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={tw`bg-yellow-300 rounded-lg p-2`}>
          <Text style={tw`text-white`}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={tw`bg-red-300 rounded-lg p-2`}>
          <Text style={tw`text-white`}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`bg-blue-300 rounded-lg p-4 mb-5`}>
        <Text style={tw`text-white font-bold text-lg`}><FontAwesome name="plus" size={16} /></Text>
      </TouchableOpacity>
      {error && <Text style={tw`text-red-500 mb-5 text-lg`}>{error}</Text>}
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={tw`justify-center items-center`}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-5 bg-white rounded-lg p-10 shadow-lg`}>
            <Text style={tw`text-lg mb-5`}>{editMode ? 'Modifier Réservation' : 'Nouvelle Réservation'}</Text>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={tw`h-12 border-gray-300 border mb-5 p-3 w-64`}>
              <Text style={tw`text-lg`}>{date || 'Sélectionner la date'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
            />
            <TouchableOpacity onPress={() => setStartTimePickerVisibility(true)} style={tw`h-12 border-gray-300 border mb-5 p-3 w-64`}>
              <Text style={tw`text-lg`}>{heureDebut || 'Sélectionner l\'heure de début'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={() => setStartTimePickerVisibility(false)}
            />
            <TouchableOpacity onPress={() => setEndTimePickerVisibility(true)} style={tw`h-12 border-gray-300 border mb-5 p-3 w-64`}>
              <Text style={tw`text-lg`}>{heureFin || 'Sélectionner l\'heure de fin'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={() => setEndTimePickerVisibility(false)}
            />
            <Picker
              selectedValue={salle}
              onValueChange={(itemValue) => setSalle(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez une Salle" value={null} />
              {salles.map((sal) => (
                <Picker.Item key={sal.id} label={sal.nomSalle} value={sal.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={emploiDuTemps}
              onValueChange={(itemValue) => setEmploiDuTemps(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez un Emploi du Temps" value={null} />
              {emploisDuTemps.map((emploi) => (
                <Picker.Item key={emploi.id} label={emploi.jour} value={emploi.id} />
              ))}
            </Picker>
            <Button title={editMode ? "Modifier" : "Ajouter"} onPress={ajouterReservation} color="#4CAF50" />
            <Button title="Annuler" onPress={() => setModalVisible(false)} color="#DD6B55" />
          </View>
        </View>
      </Modal>

      {/* AwesomeAlert */}
      <AwesomeAlert
        show={alertVisible}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default Reservation;
