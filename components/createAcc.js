import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native" 
import { FlatList, TextInput , Text, ScrollView, Dimensions, TouchableOpacity} from "react-native"

const {width,height} = Dimensions.get("window")

const CustomInput = (props)=>{
    const [isGood, setGood] = useState(true)
    return(
        <View style={styles.inputContainer}>
        <Text style={styles.label}>{props.label}:</Text>
        <TextInput style={styles.input} value={props.val} onChangeText={(e)=> props.onChange(e)} secureTextEntry={props.isPwd || false}/>
        {props.isGood ? <Text style={{color:'red'}}>* This field is required</Text> : ""}
    </View>
    )
}
 export default function CreateAccount(){
    const [userData, setUserData] = useState({})
    const [isField,setField] = useState({})
    const [isUp, setUp] = useState(false)
    useEffect(()=>{
        if(isUp){
        setField(prev=>({...prev,
            firstname:userData.firstname ? false : true,
            middlename:userData.middlename ? false : true,
            lastname:userData.lastname ? false : true,
            address:userData.address ? false : true,
            email:userData.email ? false : true,
            password:userData.password ? false : true,
            cpassword:userData.cpassword ? false : true,
        }))
    }
    console.log(userData)
    }, [userData])
    function signUp(){
        setField(prev=>({...prev,
            firstname:userData.firstname ? false : true,
            middlename:userData.middlename ? false : true,
            lastname:userData.lastname ? false : true,
            address:userData.address ? false : true,
            email:userData.email ? false : true,
            password:userData.password ? false : true,
            cpassword:userData.cpassword ? false : true,
        }))
        setUp(true)
    }
    return(
        <View style={{flex:1, margin:20}}>

          <ScrollView>
                    <CustomInput label={"Firstname"} val={userData.user} onChange={(e)=>setUserData(prev=>({...prev, firstname:e}))} isGood={isField.firstname}/>
                    <CustomInput label={"Middlename:"} val={userData.middlename} onChange={(e)=>setUserData(prev=>({...prev, middlename:e}))}   isGood={isField.middlename}/>
                    <CustomInput label={"Lastname:"} val={userData.lastname} onChange={(e)=>setUserData(prev=>({...prev, lastname:e}))}  isGood={isField.lastname}/>
                    <CustomInput label={"address:"} val={userData.address} onChange={(e)=>setUserData(prev=>({...prev, address:e}))}  isGood={isField.address}/>
                    <CustomInput label={"Email:"} val={userData.email} onChange={(e)=>setUserData(prev=>({...prev, email:e}))}  isGood={isField.email}/>
                    <CustomInput label={"Password:"} val={userData.password} onChange={(e)=>setUserData(prev=>({...prev, password:e}))} isPwd={true}  isGood={isField.password}/>
                    <CustomInput label={"Confirm Password:"} val={userData.cpasword} onChange={(e)=>setUserData(prev=>({...prev, cpassword:e}))}  isGood={isField.cpassword} isPwd={true}/>
                    <TouchableOpacity style={{width:width*0.7, padding:20, backgroundColor:'red', justifyContent:'center', alignItems:'center', borderRadius:10, alignSelf:'center', marginTop:20}} onPress={signUp}>
                    <Text style={{fontSize:20, color:'white'}}>Sing up</Text>
                    </TouchableOpacity>
          </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer:{
        // borderColor:'red',
        // borderWidth:1
        marginTop:20
    },
    input:{
        borderColor:'#828080',
        borderWidth:2,
        fontSize:15,
        padding:12,
        borderRadius:5,
        fontFamily:'poppins',
    },
    label:{
        fontFamily: "poppinsBold",
        fontSize:15,
        color:'#666464'
    }
})