import React, {useEffect, useState} from 'react'; //useEffect para executar alguma coisa quando a interface é carregada // useState pra armazenar estados
import {
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';
import userImg from '../assets/mario.png';
import colors from '../styles/colors';

import { getStatusBarHeight } from 'react-native-iphone-x-helper'; // Para resolver problemas de espaçamento no iphone.
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Header() {
  const [userName, setUserName] = useState<string>(); //tipando que é uma string v4 14:00

  useEffect(() => {
    async function loadStorageUserName() { //v4 16:40
      const user = await AsyncStorage.getItem('@plantmanager:user'); // A mesma chave que usamos para salvar o user '@plantmanger:user' usamos aqui para recuperar o nome de usuário
      setUserName(user || ''); // se tiver algo, devolve o nome do user, se nao, n devolve nada.
    }

    loadStorageUserName();
  },[]); // ,[] nesse vetor podemos passar o userName e sempre que o userName mudar ele dispara também o useEffect // [] quando deixamos sem nada, vai carregar 1x só, nao depende de nada para ser recarregado
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá</Text>
        <Text style={styles.userName}>
          {userName} 
        </Text>
      </View>
      <Image source={userImg} style={styles.image}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row', // Row pois as coisas estão uma ao lado da outra... No react native o flex já vem com padrão como column.
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },

  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },

  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40
  }


});