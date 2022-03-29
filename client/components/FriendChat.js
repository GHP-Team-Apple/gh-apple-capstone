// @refresh reset

import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, TextInput, View, Button, Dimensions, Text, ScrollView } from "react-native";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
import {db} from "../../firebase"
import { collection, query,deleteDoc, doc, updateDoc, deleteField, onSnapshot, where } from "firebase/firestore";



// const firebaseConfig = {
//   apiKey: "AIzaSyCrTUJ7X_1J7ZE5A_fIh-TiMmA6TgeyaKc",
//   authDomain: "gh-apple-capstone-f8e82.firebaseapp.com",
//   databaseURL: "https://gh-apple-capstone-f8e82-default-rtdb.firebaseio.com",
//   projectId: "gh-apple-capstone-f8e82",
//   storageBucket: "gh-apple-capstone-f8e82.appspot.com",
//   messagingSenderId: "985007094941",
//   appId: "1:985007094941:web:ea1cd8e1372908eecbe874",
//   measurementId: "G-YZDTJ9BHY9",
// };

// if (firebase.apps.length === 0) {
//   firebase.initializeApp(firebaseConfig);
// }

// export const db = firebase.firestore();


export default function FriendChat(props) {
  const [user, setUser] = useState({"_id":`${props.user.uid}`,"name":`${props.user.firstName}`});
//   const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  function readUser(props) {
    const user = {"_id":`${props.user.uid}`,"name":`${props.user.firstName}`};
    console.log('user in the readUser=======', user)
    if (user) {
      setUser(user);
    }
  }

  useEffect(() => {
    readUser(props);
    const chatsRef = query(collection(db, "Chats"),where("user", "in", [user, props.chatUser]));
    const unsubscribe = onSnapshot(chatsRef,(querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );


  async function handleSend(messages) {
    const writes = messages.map((m) => chatsRef.add(m));
    await Promise.all(writes);
  }

  console.log("props.chatUser", props.chatUser)
  console.log("messages", messages.length)
  return (
    <View style={styles.container}>
      <Button
        title="Back"
        onPress={() => props.handleBack()}
        style={styles.button}
        />
      <GiftedChat messages={messages} user={user} onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
    flexDirection: "column",
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderColor: "gray",
  },
  button: {
      marginTop: 400,
      justifyContent: "center",
      alignItems:"stretch"
  }
});
