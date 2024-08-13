import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import tw from 'twrnc';
import { FontAwesome } from '@expo/vector-icons';
import { Document, Packer, Paragraph, TextRun } from 'docx';






const API_URL = 'http://192.168.43.238:8000/api/Gestedt/emplois-du-temps/';

interface Module {
  id: number;
  nomModule: string;
}

interface Niveau {
  id: number;
  nomNiveau: string;
}

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
}

interface Salle {
  id: number;
  nomSalle: string;
}

interface EmploiDuTemps {
  id: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  nomModule: string;
  nomNiveau: string;
  nomProfesseur: string;
  prenomProfesseur: string;
  nomSalle: string;
  module: Module;
  niveau: Niveau;
  professeur: Professeur;
  salle: Salle | null;
}

const downloadImage = async () => {
  try {
      const uri = 'http://192.168.43.238:8000/api/Gestedt/generate-image/';
      const fileUri = FileSystem.documentDirectory + 'emploi_du_temps.png';

      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
      await Sharing.shareAsync(localUri);
  } catch (error) {
      console.error('Error downloading the image:', error);
  }
};

const EmploiDuTempsScreen: React.FC = () => {
  const [data, setData] = useState<EmploiDuTemps[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState<EmploiDuTemps | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState<number | null>(null);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState<number | null>(null);
  const [selectedSalleId, setSelectedSalleId] = useState<number | null>(null);
  const [jour, setJour] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [isDayPickerVisible, setDayPickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [searchDate, setSearchDate] = useState<string | null>(null);

  const showDayPicker = () => setDayPickerVisibility(true);
  const hideDayPicker = () => setDayPickerVisibility(false);
  const handleDayConfirm = (date: Date) => {
    setJour(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
    hideDayPicker();
  };

  const [showSuccessAlert, setShowSuccessAlert] = useState<{ type: 'add' | 'edit' | 'delete' | null }>({ type: null });

  const showStartTimePicker = () => setStartTimePickerVisibility(true);
  const hideStartTimePicker = () => setStartTimePickerVisibility(false);
  const handleStartTimeConfirm = (time: Date) => {
    setHeureDebut(time.toTimeString().split(' ')[0]); // Format time as HH:MM:SS
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimePickerVisibility(true);
  const hideEndTimePicker = () => setEndTimePickerVisibility(false);
  const handleEndTimeConfirm = (time: Date) => {
    setHeureFin(time.toTimeString().split(' ')[0]); // Format time as HH:MM:SS
    hideEndTimePicker();
  };

  const fetchData = async () => {
    try {
      const [emploisResponse, modulesResponse, niveauxResponse, professeursResponse, sallesResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get('http://192.168.43.238:8000/api/Gestedt/modules/'),
        axios.get('http://192.168.43.238:8000/api/Gestedt/niveaux/'),
        axios.get('http://192.168.43.238:8000/api/Gestedt/ProfesseurList/'),
        axios.get('http://192.168.43.238:8000/api/Gestedt/salles/')
      ]);

      setData(emploisResponse.data);
      setModules(modulesResponse.data);
      setNiveaux(niveauxResponse.data);
      setProfesseurs(professeursResponse.data);
      setSalles(sallesResponse.data);
      setError(null);
    } catch (err) {
      setError('Erreur de chargement des données');
      Alert.alert('Erreur', 'Impossible de récupérer les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedModuleId || !selectedNiveauId || !selectedProfesseurId || !jour || !heureDebut || !heureFin) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    try {
      if (currentEmploi) {
        await axios.put(`${API_URL}${currentEmploi.id}/`, {
          module: selectedModuleId,
          niveau: selectedNiveauId,
          professeur: selectedProfesseurId,
          salle: selectedSalleId,
          jour,
          heure_debut: heureDebut,
          heure_fin: heureFin
        });
        setShowSuccessAlert({ type: 'edit' });
      } else {
        await axios.post(API_URL, {
          module: selectedModuleId,
          niveau: selectedNiveauId,
          professeur: selectedProfesseurId,
          salle: selectedSalleId,
          jour,
          heure_debut: heureDebut,
          heure_fin: heureFin
        });
        setShowSuccessAlert({ type: 'add' });
      }
      fetchData();
      setModalVisible(false);
      resetForm();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setShowSuccessAlert({ type: 'delete' });
      fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const openModal = (emploi: EmploiDuTemps | null = null) => {
    if (emploi) {
      setCurrentEmploi(emploi);
      setSelectedModuleId(emploi.module.id);
      setSelectedNiveauId(emploi.niveau.id);
      setSelectedProfesseurId(emploi.professeur.id);
      setSelectedSalleId(emploi.salle?.id || null);
      setJour(emploi.jour);
      setHeureDebut(emploi.heure_debut);
      setHeureFin(emploi.heure_fin);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentEmploi(null);
    setSelectedModuleId(null);
    setSelectedNiveauId(null);
    setSelectedProfesseurId(null);
    setSelectedSalleId(null);
    setJour('');
    setHeureDebut('');
    setHeureFin('');
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet emploi du temps ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => handleDelete(id) }
      ]
    );
  };

  const handleSearch = () => {
    if (searchDate) {
      const filteredData = data.filter(emploi => emploi.jour === searchDate);
      if (filteredData.length === 0) {
        Alert.alert('Aucun emploi du temps trouvé', `Aucun emploi du temps trouvé pour la date: ${searchDate}`, [
          { text: 'OK', onPress: () => setSearchDate(null) }
        ]);
      } else {
        setData(filteredData);
      }
    } else {
      fetchData();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const showAlert = showSuccessAlert.type !== null;

  return (
<ScrollView>
  <View style={tw`flex-1 p-4`}>
    <View style={tw`flex-row justify-between mb-4`}>
      <TouchableOpacity onPress={() => openModal()} style={tw` p-3 rounded`}>
        <FontAwesome name="plus" size={24} color="blue" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => fetchData()} style={tw` p-3 rounded`}>
        <FontAwesome name="refresh" size={24} color="blu" />
      </TouchableOpacity>
    </View>
    <View style={tw`flex-row items-center justify-between p-3`}>
    <TouchableOpacity onPress={showDayPicker} style={tw`bg-blue-500 p-2 rounded`}>
        <Text style={tw`text-white text-center text-sm`}>
          {searchDate ? `Date : ${searchDate}` : 'Sélectionner une date'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDayPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setSearchDate(date.toISOString().split('T')[0]);
          hideDayPicker();
        }}
        onCancel={hideDayPicker}
      />
      <TouchableOpacity onPress={handleSearch} style={tw`bg-blue-500 p-2 rounded ml-2`}>
        <FontAwesome name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={tw`p-4 bg-white mb-2 rounded`}>
          <Text>{`Jour: ${item.jour}`}</Text>
          <Text>{`Heure: ${item.heure_debut} - ${item.heure_fin}`}</Text>
          <Text>{`Module: ${item.nomModule}`}</Text>
          <Text>{`Niveau: ${item.nomNiveau}`}</Text>
          <Text>{`Professeur: ${item.nomProfesseur} ${item.prenomProfesseur}`}</Text>
          <Text>{`Salle: ${item.nomSalle}`}</Text>
          <View style={tw`flex-row justify-start mt-3`}>
        <TouchableOpacity onPress={() => openModal(item)} style={tw`bg-pink-500 p-2 rounded items-center justify-center`}>
          <FontAwesome name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={tw`bg-red-500 p-2 rounded items-center justify-center ml-2`}>
          <FontAwesome name="trash" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
                onPress={downloadImage} 
                style={tw`bg-green-500 p-2 rounded items-center justify-center ml-2`}
            >
                <FontAwesome name="download" size={24} color="#fff" />
            </TouchableOpacity>
      </View>


        </View>
      )}
    />
    <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl mb-4`}>{currentEmploi ? 'Modifier l\'emploi du temps' : 'Ajouter un emploi du temps'}</Text>
        {error && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
        <TouchableOpacity onPress={showDayPicker} style={tw`bg-blue-500 p-3 rounded mb-2`}>
          <Text style={tw`text-white text-center`}>{jour ? `Jour sélectionné : ${jour}` : 'Sélectionner un jour'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDayPickerVisible}
          mode="date"
          onConfirm={handleDayConfirm}
          onCancel={hideDayPicker}
        />
        <TouchableOpacity onPress={showStartTimePicker} style={tw`bg-blue-500 p-3 rounded mb-2`}>
          <Text style={tw`text-white text-center`}>{heureDebut ? `Heure de début : ${heureDebut}` : 'Sélectionner une heure de début'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />
        <TouchableOpacity onPress={showEndTimePicker} style={tw`bg-blue-500 p-3 rounded mb-2`}>
          <Text style={tw`text-white text-center`}>{heureFin ? `Heure de fin : ${heureFin}` : 'Sélectionner une heure de fin'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />
        <Picker selectedValue={selectedModuleId} onValueChange={(itemValue) => setSelectedModuleId(itemValue)}>
          <Picker.Item label="Sélectionner un module" value={null} />
          {modules.map((module) => (
            <Picker.Item key={module.id} label={module.nomModule} value={module.id} />
          ))}
        </Picker>
        <Picker selectedValue={selectedNiveauId} onValueChange={(itemValue) => setSelectedNiveauId(itemValue)}>
          <Picker.Item label="Sélectionner un niveau" value={null} />
          {niveaux.map((niveau) => (
            <Picker.Item key={niveau.id} label={niveau.nomNiveau} value={niveau.id} />
          ))}
        </Picker>
        <Picker selectedValue={selectedProfesseurId} onValueChange={(itemValue) => setSelectedProfesseurId(itemValue)}>
          <Picker.Item label="Sélectionner un professeur" value={null} />
          {professeurs.map((professeur) => (
            <Picker.Item key={professeur.id} label={`${professeur.nom} ${professeur.prenom}`} value={professeur.id} />
          ))}
        </Picker>
        <Picker selectedValue={selectedSalleId} onValueChange={(itemValue) => setSelectedSalleId(itemValue)}>
          <Picker.Item label="Sélectionner une salle" value={null} />
          {salles.map((salle) => (
            <Picker.Item key={salle.id} label={salle.nomSalle} value={salle.id} />
          ))}
        </Picker>
        <TouchableOpacity onPress={handleSubmit} style={tw`bg-green-500 p-3 rounded mt-5`}>
          <Text style={tw`text-white text-center`}>{currentEmploi ? 'Modifier' : 'Ajouter'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeModal} style={tw`bg-red-500 p-3 rounded mt-2`}>
          <Text style={tw`text-white text-center`}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={showSuccessAlert.type === 'add' ? 'Succès' : showSuccessAlert.type === 'edit' ? 'Modification réussie' : 'Suppression réussie'}
      message={showSuccessAlert.type === 'add' ? 'L\'emploi du temps a été ajouté avec succès' : showSuccessAlert.type === 'edit' ? 'L\'emploi du temps a été modifié avec succès' : 'L\'emploi du temps a été supprimé avec succès'}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText="OK"
      confirmButtonColor="#DD6B55"
      onConfirmPressed={() => setShowSuccessAlert({ type: null })}
    />
  </View>
</ScrollView>
  );
};

export default EmploiDuTempsScreen;
