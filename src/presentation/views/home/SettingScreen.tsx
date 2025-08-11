import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { useAuth } from '../../hooks/useAuth';

export const SettingScreen = () => {

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const {user} = useAuth();

  useEffect(() => {
    const messageRef =  firestore().collection('messages');

    const unsubscribe = messageRef
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const loadMessages = snapshot.docs.map(doc => doc.data());
        console.log(user);
        setMessages(loadMessages);  
      });

      return () => unsubscribe();

  },[]);

  const sendMessage = async () => {

    if(message.trim() === '') return;

    const newMessage = {
      fullName: user?.fullName,
      message: message,
      timestamp: Date.now(),
      token: ""
    }

    console.log(newMessage);

    const response = await fetch('http://10.0.2.2:3000/api/v1/notification/message',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });

    if(response.ok) {
      setMessage('');
    }else{
      console.log("Error al enviar el mensaje:");
    }
    

  }

  const isCurrentUser = (message: any) => {
    return message.fullName === user?.fullName;
  }

  return (
     <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({item}) => (
              <View
                style={[
                  styles.messageContainer,
                  isCurrentUser(item) ? styles.currentUserMessage : styles.otherUserMessage
                  ]}
                > 
                 {!isCurrentUser(item) && <Text style={styles.senderName}>{item.fullName}</Text>}
                <Text style={styles.message}>{item.message}</Text>
              </View>
            )
          }
          keyExtractor={(item, index) => item.timestamp.toString()}
        />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder='Escribe un mensaje...'
        />
        <Button title="Enviar" onPress={sendMessage}/>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%', // Limita el ancho del mensaje
  },
  currentUserMessage: {
    backgroundColor: '#007bff', // Azul para el mensaje del usuario
    alignSelf: 'flex-end', // Alinea a la derecha
    marginRight: 10,
  },
  otherUserMessage: {
    backgroundColor: '#000000', // Gris para los mensajes de otros usuarios
    alignSelf: 'flex-start', // Alinea a la izquierda
    marginLeft: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff', // Color del texto para el mensaje (blanco en el mensaje del usuario)
  },
  senderName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});