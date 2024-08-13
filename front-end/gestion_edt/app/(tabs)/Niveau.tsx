import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';

const Niveau: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomNiveau, setNomNiveau] = useState('');
  const [departementId, setDepartementId] = useState('');
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentNiveauId, setCurrentNiveauId] = useState<number | null>(null);
  const [niveauToDelete, setNiveauToDelete] = useState<number | null>(null);

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/niveaux/');
      setNiveaux(response.data);
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

  const fetchDepartements = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/departements/');
      setDepartements(response.data);
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

  useEffect(() => {
    fetchNiveaux();
    fetchDepartements();
  }, []);

  const ajouterNiveau = async () => {
    setLoading(true);
    try {
      await axios.post('http://192.168.43.238:8000/api/Gestedt/niveaux/', { nomNiveau, departement: departementId });
      fetchNiveaux();
      setModalVisible(false);
      setNomNiveau('');
      setDepartementId('');
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de l\'ajout du niveau:', error);
    } finally {
      setLoading(false);
    }
  };

  const mettreAJourNiveau = async () => {
    setLoading(true);
    try {
      if (currentNiveauId !== null) {
        await axios.put(`http://192.168.43.238:8000/api/Gestedt/niveaux/${currentNiveauId}/`, { nomNiveau, departement: departementId });
        fetchNiveaux();
        setModalVisible(false);
        setNomNiveau('');
        setDepartementId('');
        setError(null);
        setShowAlert(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la mise à jour du niveau:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerNiveau = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://192.168.43.238:8000/api/Gestedt/niveaux/${id}/`);
      fetchNiveaux();
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la suppression du niveau:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (niveau: any) => {
    setNomNiveau(niveau.nomNiveau);
    setDepartementId(niveau.departement.id.toString());
    setCurrentNiveauId(niveau.id);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setNiveauToDelete(id);
    setShowConfirmDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (niveauToDelete !== null) {
      supprimerNiveau(niveauToDelete);
      setNiveauToDelete(null);
    }
    setShowConfirmDeleteAlert(false);
  };

  const cancelDelete = () => {
    setNiveauToDelete(null);
    setShowConfirmDeleteAlert(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-white rounded-lg shadow-md mb-4 p-4 w-80`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-bold`}>{item.nomNiveau}</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={tw`mr-2`}>
            <FontAwesome name="edit" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <FontAwesome name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={tw`text-gray-600`}>Département: {item.departement.nomDepartement}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`bg-purple-300 rounded-lg p-4 mb-5`}>
        <Text style={tw`text-white font-bold text-lg`}><FontAwesome name="plus" size={16} /></Text>
      </TouchableOpacity>
      {error && <Text style={tw`text-red-500 mb-5 text-lg`}>{error}</Text>}
      <FlatList
        data={niveaux}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={tw`justify-center items-center`}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setCurrentNiveauId(null);
        }}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-5 bg-white rounded-lg p-10 shadow-lg`}>
            <Text style={tw`text-lg mb-5`}>{currentNiveauId ? 'Modifier Niveau' : 'Nouveau Niveau'}</Text>
            <TextInput
              placeholder="Nom du Niveau"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={nomNiveau}
              onChangeText={setNomNiveau}
            />
            <Picker
              selectedValue={departementId}
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              onValueChange={(itemValue) => setDepartementId(itemValue.toString())}
            >
              <Picker.Item label="Sélectionner un département" value="" />
              {departements.map((departement) => (
                <Picker.Item key={departement.id} label={departement.nomDepartement} value={departement.id.toString()} />
              ))}
            </Picker>
            <View style={tw`flex-row justify-between w-full`}>
              <TouchableOpacity
                style={tw`bg-green-500 rounded-lg p-4 w-28`}
                onPress={currentNiveauId ? mettreAJourNiveau : ajouterNiveau}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>{currentNiveauId ? 'Modifier' : 'Enregistrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 rounded-lg p-4 w-28`}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setNomNiveau('');
                  setDepartementId('');
                  setCurrentNiveauId(null);
                }}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={showAlert}
        showProgress={loading}
        title="Succès"
        message="L'opération a été effectuée avec succès."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#4CAF50"
        onConfirmPressed={() => setShowAlert(false)}
        contentContainerStyle={tw`p-5 rounded-lg w-11/12`}
        titleStyle={tw`text-2xl font-bold`}
        messageStyle={tw`text-lg text-center`}
      />
      <AwesomeAlert
        show={showConfirmDeleteAlert}
        showProgress={loading}
        title="Confirmation"
        message="Voulez-vous vraiment supprimer ce niveau ?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Oui"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={confirmDelete}
        showCancelButton={true}
        cancelText="Non"
        cancelButtonColor="#4CAF50"
        onCancelPressed={cancelDelete}
        contentContainerStyle={tw`p-5 rounded-lg w-11/12`}
        titleStyle={tw`text-2xl font-bold`}
        messageStyle={tw`text-lg text-center`}
      />
    </View>
  );
};

export default Niveau;
