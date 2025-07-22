import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { PropsWithChildren, useEffect } from 'react'
import { Props } from 'react-native-paper'
import { RootStackParamList } from '../routes/StackNavigation'
import { useAuth } from '../hooks/useAuth'

export const AuthProvider = ({children}: PropsWithChildren) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {status, checkStatus} = useAuth();

  useEffect(() => {
    checkStatus();

    if(status !== 'checking'){
        if(status === 'authenticated'){
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
        }
    }else{
       navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
       });
    }
  }, [status]);

    
  return (
    <>
      {children}
    </>
  )
}
