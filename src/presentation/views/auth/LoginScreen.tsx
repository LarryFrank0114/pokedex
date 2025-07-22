import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/appTheme";
import { BackgroundComponent } from "../../components/BackgroundComponent";
import { useState } from "react";
import { TextInput } from "../../components/TextInput";
import { Button, Dialog, Portal } from "react-native-paper";
import { emailValidator, passwordValidator } from '../../utils/FormUtils';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes/StackNavigation";
import { BackendUseCaseImpl } from "../../../domain/useCase/implements/backendUseCaseImpl";
import { useAuth } from "../../hooks/useAuth";

export const LoginScreen = () => {

  const {login, checkStatus} = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const _onLoginPressed = async () => {

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      await login(email.value, password.value);
      const dataRegistered = checkStatus();
      if (dataRegistered != null){
          setMessage('Usuario correctamente logueado');
          showDialog();
          navigation.navigate('Home');
      }
    }catch(error: any){
      setMessage(error.message);
      showDialog();
    }
  }

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <BackgroundComponent>
      <Portal>
        <Dialog 
          visible={visible}
          onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>{message}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cerrar</Button>
            </Dialog.Actions>
        </Dialog>
      </Portal>
      <Image source={require('../../../../assets/logo.png')} style={styles.image} />
      <Text style={styles.header}>Bienvenido</Text>
      <TextInput 
        label = "Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput 
        label = "Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button mode="contained" onPress={_onLoginPressed}>
        Iniciar Sesión
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>¿No estas registrado? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </BackgroundComponent>
  )
}

  const styles = StyleSheet.create({
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    label: {
      color: colors.dark,
    },
    link: {
      fontWeight: 'bold',
      color: colors.primary,
    },
    image: {
        width: 128,
        height: 128,
        marginBottom: 12,
      },
    header: {
      fontSize: 26,
      color: colors.primary,
      fontWeight: 'bold',
      paddingVertical: 14,
    },
  });
  