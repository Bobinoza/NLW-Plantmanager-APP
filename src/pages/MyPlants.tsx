import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Alert
} from 'react-native';

import { Header } from '../components/Header';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { loadPlant, PlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]); // v4 1:33:00 //estado para as plantas
  const [loading, setLoading] = useState(true); // para simular o carregamento
  const [nextWaterd, setNextWatered] = useState<string>(); // o estado vai ser uma string 

  function handleRemove(plant: PlantProps) { // v5 18:50 
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 😡',
        style: 'cancel'
      },
      {
        text: 'Sim 🤠',
        onPress: async () => {
          try {       
            await removePlant(plant.id) //v5 26:30   
            setMyPlants((oldData) =>  //v5 23:20
              oldData.filter((item) => item.id !== plant.id) // filtrar. Me devolve todos os itens que tiver aí, mas só o que o id for diferente de plant.id
            );
          } catch (error) { // v5 24:15 caso dê algo errado
            Alert.alert('Não foi possível remover! 💩');
          }
        }
      }

    ])
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant(); // pegando as plantas armazenadas do loadPlant //v4 1:34:20

      const nextTime = formatDistance( // formatDistance calcula pra gente qual que é a distância de uma data para outra
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(), // para deixar formatado na hr de PT-BR
        { locale: pt }
      )

      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} às ${nextTime} horas`
      )

      setMyPlants(plantsStoraged);
      setLoading(false); // para parar o carregamento

    }

    loadStorageData(); // para carregar a informação

  },[])

  if(loading) // se o loading for verdadeiro, vai retornar o <Load />
    return <Load />

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image 
          source={waterdrop} 
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList 
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary 
              data={item} 
              handleRemove={() => {handleRemove(item)}} // v5 18:30 delet plant
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  spotlightImage: {
    width: 60,
    height: 60,
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },

  plants: {
    flex: 1,
    width: '100%'
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  },
})