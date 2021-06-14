import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView, // Ao clicar no teclado, os elementos sobem, n ficam escondidos...
  Platform,  // / Ao clicar no teclado, os elementos sobem, n ficam escondidos...
  TouchableWithoutFeedback, // Para eu conseguir fechar o teclado ao clicar em qualquer parte da tela. <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
  Keyboard, // para eu conseguir fechar o teclado ao clicar em qualquer parte da tela.
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Biblioteca para armazenar dados no telefone do usuário

import {Button} from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false); // O padrão é false. //
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>(); // <string> para tipar.

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name); // Se sair do input e tiver contúdo no name, continua verde. // !! vai transformar em um bolean. Se tem conteúdo true, se não, false.
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputChange(value: string) { // identificar toda vez que o input muda
    setIsFilled(!!value); // !! vai transformar em um bolean. Se tem conteúdo true, se não, false.
    setName(value);
  } 

  const navigation = useNavigation(); // botao navegação

  async function handleSubmit() { // botão navegação
    if(!name) //!name estou negando o name... Se não tiver nada dentro de name...
      return Alert.alert('Me diz como chamar você 😢') //v4 0:06:00 se o usuário nao digitar nada, mostrar essa mensagem.

    try{
      await AsyncStorage.setItem('@plantmanager:user', name); //setItem definir ítem que vai ser salvo // @nomedoAPP:o que estamos salvado //AsyncStorage demora um tempo para salvar os dados no telefone do usuário, então precisamos dizer que essa função é async e passar um await para o AsyncStorage v4 12:20
      navigation.navigate('Confirmation', { // v4 1:26 +- tá pegando o title,sub... lá da tela confirmation.tsx da interface
        title: 'prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
      }); 
    }catch{
      Alert.alert('Não foi possível salvar o seu nome.')
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height' }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>
                  { isFilled ? '🤩' : '🥺'}
                </Text>
                <Text style={styles.title}>
                  Como podemos {'\n'} chamar você?
                </Text>
              </View>
              
              <TextInput 
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green} // quando entrar no input, fica verde.
                ]}
                placeholder="Digite um nome"
                onBlur={handleInputBlur} // quando o user sai do textiput
                onFocus={handleInputFocus} // quando o foco vai para o input
                onChangeText={handleInputChange}
              />

              <View style={styles.footer}>
                <Button 
                  title="Confirmar"
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { // quase sempre temos esse container para envolver todo mundo...
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',

  },

  content: {
    flex: 1,
    width: '100%'
  },

  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center'
  },

  header: {
    alignItems: 'center'
  },
  
  emoji: {
    fontSize: 44
  },

  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%', // para ocupar 100% da tela.
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },

  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },

  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20
  }

});