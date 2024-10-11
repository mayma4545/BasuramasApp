import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity, Image,Text, Alert, TextInput, ScrollView } from "react-native";
import axiosConfig from "../../staticVar.js/axiosConfig";

const {width, height} = Dimensions.get("window")
export default function PremiumAccount(props){
    const [modal,setModal] = useState(false)
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [selected, setSelected] = useState({})
    async function fetchUsers() {
        try {
            const {data} = await axiosConfig.get("/user")
            setUsers(data.users)
            setSearchResult(data.users)
        } catch (error) {
            Alert.alert("Erron on fetching Users",error.message)
        }
            }
    useFocusEffect(
        useCallback(()=>{
            fetchUsers()
        },[])
    )
    useEffect(()=>{
        let res = []
       if(search.length > 0){
            for(let i = 0; i < users.length; i++){
                if(users[i]?.fullaname && users[i]?.fullaname.split(" ")[0].toLowerCase().startsWith(search.toLowerCase()) ||
                users[i]?.fullaname && users[i]?.fullaname.split(" ")[1].toLowerCase().startsWith(search.toLowerCase()) ||
                users[i]?.fullaname && users[i]?.fullaname.split(" ")[2].toLowerCase().startsWith(search.toLowerCase()) ){
                    res.push(users[i])
                }
            }
           
            // console.log(item?.fullaname.split(" ")[0].toLowerCase().startsWith(search.toLowerCase()))
        
        console.log(res)
        setSearchResult(res)
       }else{
        setSearchResult(users)
       }
    },[search])

    async function getPremium(){
        try {
            await axiosConfig.post("/user/premium",{userId:selected.id})
            Alert.alert("Success", "This User Can now access premium features!")
            fetchUsers()
            setModal(false)
        } catch (error) {
            Alert.alert("Error on getPremium", error.message)
        }
    }
    
    async function Unsubscribe(){
        try {
            await axiosConfig.post("/user/unsubscribe",{userId:selected.id})
            Alert.alert("Success", "This Account is now unsubscribe to premium account!")
            fetchUsers()
            setModal(false)
        } catch (error) {
            Alert.alert("Error on getPremium", error.message)
        }
    }
    return(
        <Modal visible={props.visible}>
            <View style={{flex:1}}>
                            <View style={{height:height*0.1, backgroundColor:'#3f8272', justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'poppinsBold', color:'white',fontSize:15 }}>Premium Account Activation</Text>
                                <TouchableOpacity style={{position:'absolute', left:10}} onPress={()=>props.setExit(false)}>
                                    <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.searchContainer}>
                                    <Image source={require("./../../assets/searchLogo.png")} style={{width:30, height:30}}/>
                                    <TextInput  style={{height:'100%', width:"100%", fontSize:15}} onChangeText={(e)=>setSearch(e)}/>
                                </View>
                                <View style={styles.searchResult}>
                                    <ScrollView>
                                    {
                                        users.length > 0 ?
                                        searchResult.map((e,i)=>{
                                            return(
                                                <View style={styles.userContainer} key={i}>
                                                <View>
                                                    <Text style={{fontSize:16, fontWeight:'bold'}}>{e.fullaname}</Text>
                                                    <Text>{e.isPremium == "true" ? "Subscribe" : "Not Subscribe"}</Text>
                                                </View>
                                                <TouchableOpacity style={{padding:10}} onPress={()=>{setModal(true); setSelected(e)}}>
                                                    <Text>view</Text>
                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }):""
                                    }
                                    </ScrollView>
                                </View>
                            </View>

            </View>
            <Modal visible={modal}>
                    <View style={{flex:1}}>
                            <View style={{height:height*0.1, backgroundColor:'#3f8272', justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'poppinsBold', color:'white',fontSize:20 }}>User Profile</Text>
                                <TouchableOpacity style={{position:'absolute', left:10}} onPress={()=>setModal(false)}>
                                    <Image source={require("./../../assets/476327_arrow_circle_left_prev_previous_icon.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={{borderColor:"red",borderWidth:1,flex:1}}>
                                    <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Fullname:</Text>
                                        <Text style={styles.textValue}>{selected.fullaname}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Address:</Text>
                                        <Text style={styles.textValue}>{selected.address}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Contact Number:</Text>
                                        <Text style={styles.textValue}>{new Date().getMonth()}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Account Create At:</Text>
                                        <Text style={styles.textValue}>{selected.createdAt?.split("T")[0]}</Text>
                                    </View>
                                    <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Account Type:</Text>
                                        <Text style={styles.textValue}>{selected.isPremium == "true" ? "Premium Account" : "Normal Account"}</Text>
                                    </View>
                                    <TouchableOpacity style={selected.isPremium == "true" ? {display:'none'}:{backgroundColor:'#9db14e', borderRadius:20, padding:10, width:"50%", marginLeft:10}} onPress={()=> getPremium()}>
                                        <Text style={{fontSize:16, color:'white', fontFamily:'poppinsBold', textAlign:'center'}}>Premium</Text>
                                    </TouchableOpacity>
            
                                    {
                                        selected.isPremium == "true"?
                                     <>
                                        <View style={styles.textCont}>
                                        <Text style={styles.textHeader}>Premium Start:</Text>
                                        <Text style={styles.textValue}>{selected.priv}</Text>
                                    </View>
                                    <TouchableOpacity style={selected.isPremium == "false" ? {display:'none'}:{backgroundColor:'#bd322b', borderRadius:20, padding:10, width:"70%", marginLeft:10}} onPress={()=> Unsubscribe()}>
                                        <Text style={{fontSize:16, color:'white', fontFamily:'poppinsBold', textAlign:'center'}}>Unsubscribe to premium</Text>
                                    </TouchableOpacity>
                                    </>
                                       :""
                                    }

                            </View>
                    </View>
                   
            </Modal>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    searchContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#1f1e1e',
        borderWidth:2,
        height:height*0.08,
        width:'80%',
        overflow:'hidden',
        alignSelf:'center',
        borderRadius:10,
        marginTop:20,
        paddingLeft:5
    },
    searchResult:{
        marginTop:20,
        // borderColor:'red',
        // borderWidth:1,
        height:height*0.7,
        padding:10
    },
    userContainer:{
        width:'100%',
        height:height*0.1,
        borderColor:'#2b2a2a',
        borderWidth:2,
        padding:5,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5,
        borderRadius:10
    },
    textCont:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        padding:10, 
        justifyContent:'flex-start'
    },
    textHeader:{
        fontSize:18, 
        fontWeight:'bold',
        marginRight:20
    },
    textValue:{
        fontSize:17
    }
})