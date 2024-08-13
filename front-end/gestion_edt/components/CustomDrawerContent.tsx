import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from 'twrnc';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={tw`flex-1`}>
      <DrawerContentScrollView 
        {...props} 
        scrollEnabled={false}
        contentContainerStyle={tw`bg-blue-100`}
      >
        <View style={tw`p-4`}>
          <Image 
            source={require('@/assets/images/tolotra.jpg')} 
            style={tw`w-24 h-24 self-center rounded-full`} 
          />
          <Text style={tw`text-center font-medium text-xl pt-2 text-blue-600`}>
            Tolotra
          </Text>
        </View>

        <DrawerItemList {...props} />
        
      </DrawerContentScrollView>

      <View style={tw`border-t border-blue-100 p-2`}>
        <Text style={tw`text-center text-red-600 font-medium`}>
          Déconnexion
        </Text>
      </View>
    </View>
  );
}
