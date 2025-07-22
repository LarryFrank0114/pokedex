/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './presentation/routes/StackNavigation';
import { PaperProvider } from 'react-native-paper';
import { NotificationProvider } from './presentation/context/NotificationProvider';
import { AuthProvider } from './presentation/context/AuthProvider';

function App(): React.JSX.Element {
  
  
  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthProvider>
          <NotificationProvider>
            <StackNavigation />
          </NotificationProvider>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;


    {/*<View style={{flex: 1}}>
       <HelloWorld name="IDAT"/> 
      <CounterApp />
      <Bom  />
      <Position />
      <Flex />
      <FlexDirection />
      <FlexExcercises />
      <Calculator />
    </View>*/}