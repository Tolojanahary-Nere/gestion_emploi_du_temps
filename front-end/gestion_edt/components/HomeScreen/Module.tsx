import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput,  } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';

const Module: React.FC = () => {  
  const [modalVisible, setModalVisible] = useState(false);
  const [nomModule, setNomModule] = useState('');
  const [code, setCode] = useState('');
  const [departementId, setDepartementId] = useState<string>('');
  const [professeurId, setProfesseurId] = useState<string>('');
  const [modules, setModules] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);
  const [professeurs, setProfesseurs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirmDeleteAlert, setShowConfirmDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/modules/');
      setModules(response.data);
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
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/departements/');
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

  const fetchProfesseurs = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/professeurs/');
      setProfesseurs(response.data);
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
    fetchModules();
    fetchDepartements();
    fetchProfesseurs();
  }, []);

  const ajouterModule = async () => {
    setLoading(true);
    try {
      await axios.post('http://10.0.2.2:8000/api/Gestedt/modules/', { nomModule, code, departement: departementId, professeur: professeurId });
      fetchModules();
      setModalVisible(false);
      setNomModule('');
      setCode('');
      setDepartementId('');
      setProfesseurId('');
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de l\'ajout du module:', error);
    } finally {
      setLoading(false);
    }
  };

  const mettreAJourModule = async () => {
    setLoading(true);
    try {
      if (currentModuleId !== null) {
        await axios.put(`http://10.0.2.2:8000/api/Gestedt/modules/${currentModuleId}/`, { nomModule, code, departement: departementId, professeur: professeurId });
        fetchModules();
        setModalVisible(false);
        setNomModule('');
        setCode('');
        setDepartementId('');
        setProfesseurId('');
        setError(null);
        setShowAlert(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la mise à jour du module:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerModule = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://10.0.2.2:8000/api/Gestedt/modules/${id}/`);
      fetchModules();
      setError(null);
      setShowAlert(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de la suppression du module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (module: any) => {
    setNomModule(module.nomModule);
    setCode(module.code);
    setDepartementId(module.departement.id.toString());
    setProfesseurId(module.professeur.id.toString());
    setCurrentModuleId(module.id);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setModuleToDelete(id);
    setShowConfirmDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (moduleToDelete !== null) {
      supprimerModule(moduleToDelete);
      setModuleToDelete(null);
    }
    setShowConfirmDeleteAlert(false);
  };

  const cancelDelete = () => {
    setModuleToDelete(null);
    setShowConfirmDeleteAlert(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={tw`bg-white rounded-lg shadow-md mb-4 p-4 w-80`}>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-lg font-bold`}>{item.nomModule} ({item.code})</Text>
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
      <Text style={tw`text-gray-600`}>Professeur: {item.professeur.nom} {item.professeur.prenom}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`bg-purple-300 rounded-lg p-4 mb-5`}>
        <Text style={tw`text-white font-bold text-lg`}><FontAwesome name="plus" size={16} /></Text>
      </TouchableOpacity>
      {error && <Text style={tw`text-red-500 mb-5 text-lg`}>{error}</Text>}
      <FlatList
        data={modules}
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
          setCurrentModuleId(null);
        }}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-5 bg-white rounded-lg p-10 shadow-lg`}>
            <Text style={tw`text-lg mb-5`}>{currentModuleId ? 'Modifier Module' : 'Nouveau Module'}</Text>
            <TextInput
              placeholder="Nom du Module"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={nomModule}
              onChangeText={setNomModule}
            />
            <TextInput
              placeholder="Code"
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              value={code}
              onChangeText={setCode}
            />
            <Picker
              selectedValue={departementId}
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              onValueChange={(itemValue: string) => setDepartementId(itemValue)}
            >
              <Picker.Item label="Sélectionner un département" value="" />
              {departements.map((departement) => (
                <Picker.Item key={departement.id} label={departement.nomDepartement} value={departement.id.toString()} />
              ))}
            </Picker>
            <Picker
              selectedValue={professeurId}
              style={tw`h-12 border-gray-300 border mb-5 p-3 w-64 text-lg`}
              onValueChange={(itemValue: string) => setProfesseurId(itemValue)}
            >
              <Picker.Item label="Sélectionner un professeur" value="" />
              {professeurs.map((professeur) => (
                <Picker.Item key={professeur.id} label={`${professeur.nom} ${professeur.prenom}`} value={professeur.id.toString()} />
              ))}
            </Picker>
            <View style={tw`flex-row justify-between w-full`}>
              <TouchableOpacity
                style={tw`bg-green-500 rounded-lg p-4 w-28`}
                onPress={currentModuleId ? mettreAJourModule : ajouterModule}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>{currentModuleId ? 'Modifier' : 'Enregistrer'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-red-500 rounded-lg p-4 w-28`}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setNomModule('');
                  setCode('');
                  setDepartementId('');
                  setProfesseurId('');
                  setCurrentModuleId(null);
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
        message="Voulez-vous vraiment supprimer ce module ?"
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

export default Module;
