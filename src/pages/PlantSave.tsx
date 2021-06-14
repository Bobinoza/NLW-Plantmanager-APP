import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { SvgFromUri } from 'react-native-svg'; // para lidar com svg
import { Button } from '../components/Button';
import { getBottomSpace } from 'react-native-iphone-x-helper'; // pega o espaçamento do iphone do bottom
import { useNavigation, useRoute } from '@react-navigation/core'; // É através do useRoute que conseguimos recuperar valores passados pela rota  //v4 42:10
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'; // { Event } pois vou tipar. // v4 46:40

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface Params { // v4 43:40 // agora q eu tenho a planta carregada, eu posso ir colocando {plant.name} {plant.photo} ...
  plant: PlantProps // v4 1:03:30
}


export function PlantSave() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date()); // por padravao vai ser uma nova data new Date() // v4 47:30
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios'); //para controlar quando vai aparecer ou nao no caso do android. v4 47:50 // se o sistema operacional for IOS mostrar como true (Platform.OS == 'ios')

  const route = useRoute(); //v4 42:30
  const { plant } = route.params as Params; //v4 42:20 // recuperando o plant lá de PlantSelect

  const navigation = useNavigation(); // v4 1:28:24

  function handleChangeTime(event: Event, dateTime: Date | undefined) { // handleChangeTime vai receber um event que o tipo é Event e um dateTime que pode receber um Date ou | um undefined  // _: Event o _ é para omitir, n vou usar o event // v4 49:04
    if(Platform.OS === 'android') {
      setShowDatePicker(oldState => !oldState); // v4 50: 20
    }

    if(dateTime && isBefore(dateTime, new Date())){ // n poder escolher uma hora que já passou // eu quero saber se dateTime é antiga a new Date() v4 51:45
      setSelectedDateTime(new Date()); // para tirar o horario antigo e voltar para o momento atual...
      return Alert.alert('Escolha uma hora no futuro! ⏰')
    }
    
    if(dateTime) // se for um dateTime que existe v4 52:55
      setSelectedDateTime(dateTime);
  }

  function handleOpenDatetimePickerForAndroid() { // v4 57:40
    setShowDatePicker(oldState => !oldState);
  }

  async function handleSave() { // 1:11 v4
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime
      });

      navigation.navigate('Confirmation', { // está pegando da page Confirmation.tsx da interface Params
        title: 'Tudo certo',
        subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
        buttonTitle: 'Muito Obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants',
      }); 

    }catch {
      Alert.alert('Não foi possível salvar. 🤬')
    }
  }

  return (
    <ScrollView // para caso o celular do user seja pequeno e nao couber todo o conteúdo nada tela.
      showsVerticalScrollIndicator={false} // para n aparecer a barrinha do lado
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}> 
        <View style={styles.plantInfo}>
          <SvgFromUri
            uri={plant.photo}
            height={150}
            width={150}
          />

          <Text style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.plantAbout}>
            {plant.about}
          </Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image 
              source={waterdrop}
              style={styles.tipImage}
            />
            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {showDatePicker && (
            <DateTimePicker // v4 48:40 // N faz sentido o DateTimePicker aparecer no android então envolvemos em {} se showDatePicker && for true, aí sim mostra ele v4 55:09
              value={selectedDateTime}
              mode="time"
              display="spinner"
              onChange={handleChangeTime}
            />
          )}

          { //se for android, adicionar
            Platform.OS === 'android' && (
              <TouchableOpacity  // criou no onPress uma função para mudar o estado
                style={styles.dateTimePickerButton}
                onPress={handleOpenDatetimePickerForAndroid}
              >
                <Text style={styles.dateTimePickerText}> 
                  {`Mudar ${format(selectedDateTime, 'HH:mm')}`}   
                </Text>
              </TouchableOpacity>
            )
          }

          <Button 
            title="Cadastrar planta"
            onPress={handleSave}
          />
        </View>
      </View>
    </ScrollView>
  )
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },

  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },

  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20 // || 20  como no android n tem isso, eu coloco o || 20 para aplicar padding de 20. v4 35:09
  },

  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },

  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10
  },

  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative', // efeito dele ficar centralizado na borda v4 40:30
    bottom: 60,
  },

  tipImage: {
    width: 56,
    height: 56,
  },

  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },

  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5
  },

  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },

  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text
  },

})

// <> </> para n ter problema em devolver 2 elementos de uma vez