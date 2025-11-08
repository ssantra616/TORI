import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TourScreen from "../screens/TourScreen";
import PeopleScreen from "../screens/PeopleScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  Home: undefined;
  Tour: undefined;
  People: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "TORI" }} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="People" component={PeopleScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
