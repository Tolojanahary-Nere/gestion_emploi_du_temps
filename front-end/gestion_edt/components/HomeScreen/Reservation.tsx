import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const Reservation: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
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

  useEffect(() => {
    fetchReservations();
    fetchSalles();
    fetchEmploisDuTemps();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/reservations/');
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
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/salles/');
      setSalles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
    }
  };

  const fetchEmploisDuTemps = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/emplois-du-temps/');
      setEmploisDuTemps(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois du temps:', error);
    }
  };

  const ajouterReservation = async () => {
    setLoading(true);
    try {
      await axios.post('http://10.0.2.2:8000/api/Gestedt/reservations/', {
        date,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        salle,
        emploi_du_temps: emploiDuTemps
      });
      fetchReservations();
      setModalVisible(false);
      setDate('');
      setHeureDebut('');
      setHeureFin('');
      setSalle(null);
      setEmploiDuTemps(null);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de l\'ajout de la réservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-white rounded-lg shadow-md mb-4 p-4 w-80`}>
      <Text style={tw`text-lg font-bold`}>Salle: {item.salle.nomSalle}</Text>
      <Text style={tw`text-gray-600`}>Date: {item.date}</Text>
      <Text style={tw`text-gray-600`}>Heure: {item.heure_debut} - {item.heure_fin}</Text>
      <Text style={tw`text-gray-600`}>Emploi du Temps: {item.emploi_du_temps.jour}</Text>
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
            <Text style={tw`text-lg mb-5`}>Nouvelle Réservation</Text>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={date}
              onChangeText={setDate}
            />
            <TextInput
              placeholder="Heure Début (HH:MM)"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={heureDebut}
              onChangeText={setHeureDebut}
            />
            <TextInput
              placeholder="Heure Fin (HH:MM)"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={heureFin}
              onChangeText={setHeureFin}
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
            <Button title="Ajouter" onPress={ajouterReservation} color="#4CAF50" />
            <Button title="Annuler" onPress={() => setModalVisible(false)} color="#DD6B55" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Reservation;
