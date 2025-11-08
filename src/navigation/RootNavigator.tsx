import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import TourScreen from "../screens/TourScreen";
import PeopleScreen from "../screens/PeopleScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Tour: undefined;
  People: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="People" component={PeopleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
