import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Card } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import tw from 'twrnc';

const screenWidth = Dimensions.get('window').width;

type DataType = {
  name: string;
  count: number;
  color: string;
};

const Page = () => {
  const [searchText, setSearchText] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'global', title: 'GLOBAL' },
    { key: 'jours', title: 'JOURS' }
  ]);

  // Mettre à jour l'état pour les données récupérées de l'API
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Faire la requête à l'API pour obtenir les statistiques
    fetch('http://192.168.43.238:8000/api/Gestedt/statistics/')
      .then(response => response.json())
      .then(data => {
        setData([
          { name: 'Professeurs', count: data.nombre_professeurs, color: '#f00' },
          { name: 'Réservations', count: data.nombre_reservations, color: '#0f0' },
          { name: 'Salles', count: data.nombre_salles, color: '#00f' },
          { name: 'Modules', count: data.nombre_modules, color: '#ff0' },
        ]);
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []);

  const navigation = useNavigation();

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.count),
        colors: data.map(item => () => item.color) // Utilisation des couleurs personnalisées
      }
    ]
  };

  const pieData = data.map(item => ({
    name: item.name,
    population: item.count,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  const renderScene = SceneMap({
    global: () => (
      <ScrollView style={tw`flex-1 p-5`}>
        <TextInput
          style={tw`h-10 border-gray-400 border mb-5 pl-2`}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Basé sur</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>Activités</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>Tags</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Jour(s)</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>TOUS LES JOURS</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Filtre</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>AUCUN FILTRE</Text>
          </TouchableOpacity>
        </View>

        <Card style={tw`mb-5`}>
          <Card.Content>
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </Card.Content>
        </Card>
      </ScrollView>
    ),
    jours: () => (
      <ScrollView style={tw`flex-1 p-5`}>
        <TextInput
          style={tw`h-10 border-gray-400 border mb-5 pl-2`}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Basé sur</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>Activités</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>Tags</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Jour(s)</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>TOUS LES JOURS</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`text-lg mr-2`}>Filtre</Text>
          <TouchableOpacity style={tw`bg-gray-200 p-2 rounded mr-2`}>
            <Text style={tw`text-sm`}>AUCUN FILTRE</Text>
          </TouchableOpacity>
        </View>

        <Card style={tw`mb-5`}>
          <Card.Content>
            <BarChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </Card.Content>
        </Card>
      </ScrollView>
    ),
  });

  return (
    <View style={tw`flex-1`}>
      <View style={tw`bg-blue-400 p-5`}>
        <Text style={tw`text-white text-lg text-center`}>Optimisez l'usage de votre temps et améliorez votre qualité de vie.</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.7,
  useShadowColorFromDataset: false // optional
};

export default Page;
