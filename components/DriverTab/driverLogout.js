import { View, Text, TouchableOpacity, } from "react-native"

export default function DriverLogout({route}){
    const navigation = route.params
    console.log(navigation)
    return( 
        <View style={{backgroundColor:'#bfcab6', flex:1, justifyContent:'center'}}>
            <TouchableOpacity style={{borderWidth:1, borderColor:'black', width:"60%", alignSelf:'center', padding:20,borderRadius:30, backgroundColor:'#294685'}} onPress={()=>{
                   navigation.reset({
                    index:0,
                    routes:[{'name':'signInStack'}]

                    // routes:[{'name':'adminStack', params:{userData: {}}}]
                })
            }}>
                <Text style={{fontSize:20, fontWeight:600, textAlign:'center',color:'white'}}>Temporary Logout</Text>
            </TouchableOpacity>
        </View>
    )
}