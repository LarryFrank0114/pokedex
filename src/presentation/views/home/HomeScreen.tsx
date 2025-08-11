import React from 'react'
import { Text, View } from 'react-native'
import { styles } from '../../theme/appTheme'
import { ButtonComponent } from '../../components/ButtonComponent'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../routes/StackNavigation'
import { useAuth } from '../../hooks/useAuth'
import { StorageAdapter } from '../../../data/sources/local/storage-adapter'

export const HomeScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {status, logout} = useAuth();
  const email = StorageAdapter.getItem('email') ?? 'No email found';

  return (
    <View style={styles.container}>
        <Text style={[styles.title, {paddingBottom: 20}]}>Menú Principal</Text>
        <ButtonComponent 
            label= "Ir a Lista de Pokemones"
            actionButton={() => navigation.navigate('Pokemons')}
        />
        <ButtonComponent 
            label= "Ir a Mensajería"
            actionButton={() => navigation.navigate('Setting')}
        />
         <ButtonComponent 
            label= "Cerrar Sesión"
            actionButton={logout}
        />
        <Text>{email}</Text>
    </View>
  )
}
