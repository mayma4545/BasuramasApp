import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadStack from './components/loadStack';
import { useFonts } from 'expo-font';
import getStartedPage from './components/getStartedPage';
import userOption from './components/userOption';
import SingInStack from './components/singInStack';
import UserMainPage from './components/userMainPage';
import CreateAccount from './components/createAcc';
import AdminTab from './components/adminTabPage/adminTab';

export default function App() {
  const [fontsLoaded] = useFonts({
    'poppins': require('./assets/fonts/Poppins-Light.ttf'),
    'poppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-italic': require('./assets/fonts/Poppins-Italic.ttf'),
    'yellowtail': require('./assets/fonts/Yellowtail-Regular.ttf'),
    'sharp': require('./assets/fonts/MedievalSharp-Regular.ttf'),
    'brit': require('./assets/fonts/BrittanySignature.ttf'),
    'bodoni': require('./assets/fonts/Bodonitown.ttf'),
    'roman': require('./assets/fonts/Times New Romance.ttf'),
    'temp': require('./assets/fonts/TemporaLGCUni-Regular.ttf'),
    'clash': require('./assets/fonts/ClashGrotesk-Regular.otf'),
    'anton': require('./assets/fonts/Anton-Regular.ttf'),
    'ptsans': require('./assets/fonts/PTSans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const Stack = createNativeStackNavigator();
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="loadStack" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
         <Stack.Screen name="loadStack" component={LoadStack}/>
         <Stack.Screen name="getStartedStack" component={getStartedPage}/>
         {/* <Stack.Screen  name="userOptionStack" component={userOption}/> */}
        <Stack.Screen   name="CreateAccountStack" component={CreateAccount} options={{headerShown:true, title:'Sign Up'}}/>
         <Stack.Screen  name="signInStack" component={SingInStack}/>
         <Stack.Screen  name="adminTab" component={AdminTab}/>
         <Stack.Screen  name="userMainStack" component={UserMainPage}/>
      
       
      </Stack.Navigator>
      {/* <StatusBar hidden={false} /> */}
    </NavigationContainer>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
