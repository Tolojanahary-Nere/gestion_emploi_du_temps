import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/CustomDrawerContent';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView>
      <Drawer 
        drawerContent={CustomDrawerContent} 
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveBackgroundColor: '#5363df',
          drawerActiveTintColor: '#fff',
          drawerLabelStyle: { marginLeft: -20 },
        }}
      >
        <Drawer.Screen 
          name="index" 
          options={{
            drawerLabel: "Accueil",
            headerTitle: "Accueil",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="profs" 
          options={{
            drawerLabel: "Professeurs",
            headerTitle: "Professeurs",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Salle" 
          options={{
            drawerLabel: "Salle",
            headerTitle: "Salle",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="business-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="EmploiDuTemps" 
          options={{
            drawerLabel: "Emploi du temps",
            headerTitle: "Emploi du temps",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Reservation" 
          options={{
            drawerLabel: "Réservation Salle",
            headerTitle: "Réservation Salle",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="bookmark-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Module" 
          options={{
            drawerLabel: "Module",
            headerTitle: "Module",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Niveau" 
          options={{
            drawerLabel: "Niveau",
            headerTitle: "Niveau",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="layers-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Departement" 
          options={{
            drawerLabel: "Département",
            headerTitle: "Département",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
