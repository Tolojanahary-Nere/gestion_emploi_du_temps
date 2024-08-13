import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';

const Salle: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomSalle, setNomSalle] = useState('');
  const [batiment, setBatiment] = useState('');
  const [lieu, setLieu] = useState('');
  const [estLibre, setEstLibre] = useState(true);
  const [salles, setSalles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSalleId, setCurrentSalleId] = useState<number | null>(null);
  const [salleToDelete, setSalleToDelete] = useState<number | null>(null);

  const fetchSalles = async () => {
    try {
      const response = await axios.get('http://192.168.43.238:8000/api/Gestedt/salles/');
      setSalles(response.data);
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
    fetchSalles();
  }, []);

  const ajouterSalle = async () => {
    setLoading(true);
    try {
      await axios.post('http://192.168.43.238:8000/api/Gestedt/salles/', { nomSalle, batiment, lieu, est_libre: estLibre });
      fetchSalles();
      setModalVisible(false);
      setNomSalle('');
      setBatiment('');
      setLieu('');
      setEstLibre(true);
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de l\'ajout de la salle:', error);
    } finally {
      setLoading(false);
    }
  };

  const mettreAJourSalle = async () => {
    setLoading(true);
    try {
      if (currentSalleId !== null) {
        await axios.put(`http://192.168.43.238:8000/api/Gestedt/salles/${currentSalleId}/`, { nomSalle, batiment, lieu, est_libre: estLibre });
        fetchSalles();
        setModalVisible(false);
        setNomSalle('');
        setBatiment('');
        setLieu('');
        setEstLibre(true);
        setError(null);
        setShowAlert(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la mise à jour de la salle:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerSalle = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://192.168.43.238:8000/api/Gestedt/salles/${id}/`);
      fetchSalles();
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la suppression de la salle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (salle: any) => {
    setNomSalle(salle.nomSalle);
    setBatiment(salle.batiment);
    setLieu(salle.lieu);
    setEstLibre(salle.est_libre);
    setCurrentSalleId(salle.id);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setSalleToDelete(id);
    setShowConfirmDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (salleToDelete !== null) {
      supprimerSalle(salleToDelete);
      setSalleToDelete(null);
    }
    setShowConfirmDeleteAlert(false);
  };

  const cancelDelete = () => {
    setSalleToDelete(null);
    setShowConfirmDeleteAlert(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-white rounded-lg shadow-md mb-4 p-4 w-80`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-bold`}>{item.nomSalle}</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={tw`mr-2`}>
            <FontAwesome name="edit" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <FontAwesome name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={tw`text-gray-600`}>Bâtiment: {item.batiment}</Text>
      <Text style={tw`text-gray-600`}>Lieu: {item.lieu}</Text>
      <Text style={tw`text-gray-600`}>Est Libre: {item.est_libre ? 'Oui' : 'Non'}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`bg-purple-300 rounded-lg p-4 mb-5`}>
        <Text style={tw`text-white font-bold text-lg`}><FontAwesome name="plus" size={16} /></Text>
      </TouchableOpacity>
      {error && <Text style={tw`text-red-500 mb-5 text-lg`}>{error}</Text>}
      <FlatList
        data={salles}
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
          setCurrentSalleId(null);
        }}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-5 bg-white rounded-lg p-10 shadow-lg`}>
            <Text style={tw`text-lg mb-5`}>{currentSalleId ? 'Modifier Salle' : 'Nouvelle Salle'}</Text>
            <TextInput
              placeholder="Nom de la Salle"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={nomSalle}
              onChangeText={setNomSalle}
            />
            <TextInput
              placeholder="Bâtiment"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={batiment}
              onChangeText={setBatiment}
            />
            <TextInput
              placeholder="Lieu"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={lieu}
              onChangeText={setLieu}
            />
            <View style={tw`flex-row items-center mb-5`}>
              <Text style={tw`text-lg mr-3`}>Est Libre:</Text>
              <Switch
                value={estLibre}
                onValueChange={setEstLibre}
                style={tw`ml-2`}
              />
            </View>
            <View style={tw`flex-row justify-between w-full`}>
              <TouchableOpacity
                style={tw`bg-green-500 rounded-lg p-4 w-28`}
                onPress={currentSalleId ? mettreAJourSalle : ajouterSalle}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>{currentSalleId ? 'Modifier' : 'Enregistrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 rounded-lg p-4 w-28`}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setNomSalle('');
                  setBatiment('');
                  setLieu('');
                  setEstLibre(true);
                  setCurrentSalleId(null);
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
        message="Voulez-vous vraiment supprimer cette salle ?"
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

export default Salle;
