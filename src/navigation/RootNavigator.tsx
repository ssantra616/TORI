import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import ActionsScreen from "../screens/ActionsScreen";
import TourScreen from "../screens/TourScreen";
import PeopleScreen from "../screens/PeopleScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ToriMain from "../screens/ToriMain";
import ItineraryScreen from "../screens/ItineraryScreen";


export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Actions: undefined;
  Tour: undefined;
  People: undefined;
  Settings: undefined;
  ToriMain: undefined;
  Itinerary: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Actions" component={ActionsScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="People" component={PeopleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ToriMain" component={ToriMain} />
      <Stack.Screen name="Itinerary" component={ItineraryScreen} options={{ animation: "slide_from_right" }} />


    </Stack.Navigator>
  );
}
