import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";


export default async function StoreDataAsync(key, data){
    try {
        await AsyncStorage.setItem(key, data)
        console.log(`${key} is Saved!`)
    } catch (error) {
        Alert.alert(error.message)
    }
}
