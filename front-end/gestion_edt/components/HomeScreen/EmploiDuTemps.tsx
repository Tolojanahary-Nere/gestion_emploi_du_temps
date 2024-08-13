import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker';

const EmploiDuTemps: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [jour, setJour] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [module, setModule] = useState<number | null>(null);
  const [niveau, setNiveau] = useState<number | null>(null);
  const [professeur, setProfesseur] = useState<number | null>(null);
  const [salle, setSalle] = useState<number | null>(null);
  const [emploisDuTemps, setEmploisDuTemps] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [professeurs, setProfesseurs] = useState<any[]>([]);
  const [salles, setSalles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmploisDuTemps();
    fetchModules();
    fetchNiveaux();
    fetchProfesseurs();
    fetchSalles();
  }, []);

  const fetchEmploisDuTemps = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/emplois-du-temps/');
      setEmploisDuTemps(response.data);
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

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/modules/');
      setModules(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des modules:', error);
    }
  };

  const fetchNiveaux = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/niveaux/');
      setNiveaux(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des niveaux:', error);
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/Gestedt/ProfesseurList/');
      setProfesseurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des professeurs:', error);
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

  const ajouterEmploiDuTemps = async () => {
    setLoading(true);
    try {
      await axios.post('http://10.0.2.2:8000/api/Gestedt/emplois-du-temps/', {
        jour,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        module,
        niveau,
        professeur,
        salle
      });
      fetchEmploisDuTemps();
      setModalVisible(false);
      setJour('');
      setHeureDebut('');
      setHeureFin('');
      setModule(null);
      setNiveau(null);
      setProfesseur(null);
      setSalle(null);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur lors de l\'ajout de l\'emploi du temps:', error);
    } finally {
      setLoading(false);
    }
  };

  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={tw`flex-row border p-2`}>
        <View style={tw`flex-1 border-r p-2`}>
          <Text>{item.heure_debut}</Text>
        </View>
        <View style={tw`flex-1 border-r p-2`}>
          <Text>{item.jour}</Text>
        </View>
        <View style={tw`flex-2 p-2`}>
          <Text>{item.module.nomModule} ({item.niveau.nomNiveau})</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 p-5`}>
      <FlatList
        data={emploisDuTemps}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        ListEmptyComponent={<Text style={tw`text-gray-500`}>Aucun emploi du temps disponible</Text>}
      />
      {error && <Text style={tw`text-red-500 mb-5 text-lg`}>{error}</Text>}
      <Button title="Ajouter un emploi du temps" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-5 bg-white rounded-lg p-10 shadow-lg`}>
            <Text style={tw`text-lg mb-5`}>Nouvel Emploi du Temps</Text>
            <Picker
              selectedValue={jour}
              onValueChange={(itemValue) => setJour(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez un Jour" value={null} />
              {jours.map((jour) => (
                <Picker.Item key={jour} label={jour} value={jour} />
              ))}
            </Picker>
            <Picker
              selectedValue={heureDebut}
              onValueChange={(itemValue) => setHeureDebut(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez l'Heure de Début" value={null} />
              {heures.map((heure) => (
                <Picker.Item key={heure} label={heure} value={heure} />
              ))}
            </Picker>
            <Picker
              selectedValue={heureFin}
              onValueChange={(itemValue) => setHeureFin(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez l'Heure de Fin" value={null} />
              {heures.map((heure) => (
                <Picker.Item key={heure} label={heure} value={heure} />
              ))}
            </Picker>
            <Picker
              selectedValue={module}
              onValueChange={(itemValue) => setModule(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez un Module" value={null} />
              {modules.map((mod) => (
                <Picker.Item key={mod.id} label={mod.nomModule} value={mod.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={niveau}
              onValueChange={(itemValue) => setNiveau(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez un Niveau" value={null} />
              {niveaux.map((niv) => (
                <Picker.Item key={niv.id} label={niv.nomNiveau} value={niv.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={professeur}
              onValueChange={(itemValue) => setProfesseur(itemValue)}
              style={tw`h-12 border-gray-300 border mb-5 w-64`}
            >
              <Picker.Item label="Sélectionnez un Professeur" value={null} />
              {professeurs.map((prof) => (
                <Picker.Item key={prof.id} label={prof.nomProfesseur} value={prof.id} />
              ))}
            </Picker>
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
            <View style={tw`flex-row justify-between`}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Ajouter" onPress={ajouterEmploiDuTemps} disabled={loading} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmploiDuTemps;
