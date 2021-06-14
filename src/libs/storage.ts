// .ts pois não precisamos nos preocupar em renderizar elementos aqui dentro
// v4 1:02
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'; // importando tudo dentro de Notifications vindo de 'expo-notifications'
import { format, nextDay } from 'date-fns';

export interface PlantProps {  
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string
  dateTimeNotification: Date;
}

export interface StoragePlantProps { // salvando as plantas em formato de objeto //v4 1:04:35
  [id: string] : {
    data: PlantProps;
    notificationId: string;
  }
}
// salvar planta
export async function savePlant(plant: PlantProps) : Promise<void> { // : Promise<void> estou dizendo que é uma promise que não vai devolver nada, nao retorna nada
  try {
    const nexTime = new Date(plant.dateTimeNotification); // v5 29:10 +-
    const now = new Date();

    const { times, repeat_every } = plant.frequency;
    if(repeat_every === 'week'){
      const interval = Math.trunc(7 / times);
      nexTime.setDate(now.getTime() + interval);
    } //else
    //   nexTime.setDate(nexTime.getDate() + 1)
    
    const seconds = Math.abs( 
      Math.ceil(now.getTime() - nexTime.getTime()) / 100
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heeey, 🪴',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true, // para tocar barulho no celular
        priority: Notifications.AndroidNotificationPriority.HIGH, // para dar prioridade para a notificação
        data: { //estou anexando na notificação todos os detalhes de planta plant
          plant
        },
      },
      trigger: { // gatilho de quando essa notificação deve ser executada.
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true
      }
    });


    const data = await AsyncStorage.getItem('@plantmanager:plants'); // por padrao salva tudo como texto
    const oldPants = data ? (JSON.parse(data) as StoragePlantProps) : {}; //  estou fazendo ele converter para um objeto tipo json e o tipo dele as tem que ser conforme o tipo de storagePlantProps // ser tiver dados fazer a conversão, se não : {} devolver um objeto vazio v4 1:08 
    
    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId
      }
    }

    await AsyncStorage.setItem('@plantmanager:plants', // v4 1:10 +-
    JSON.stringify({
      ...newPlant,
      ...oldPants
    }));  
  
  }catch(error) { // ta pegando o erro /v4 1:07:25
    throw new Error(error);
  }
}

// load planta
export async function loadPlant() : Promise<PlantProps[]> { // PlantProps[] vai devolver um plantProps com um vetor com vários plantsprops
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants'); // por padrao salva tudo como texto
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}; //  estou fazendo ele converter para um objeto tipo json e o tipo dele as tem que ser conforme o tipo de storagePlantProps // ser tiver dados fazer a conversão, se não : {} devolver um objeto vazio v4 1:08 
     
    const plantsSorted = Object //transformando em um objeto
    .keys(plants) //vai percorrer cada chave que existe dentro de plants
    .map((plant) => {
      return {
        ...plants[plant].data, // estou pegando as minhas plantas (plants) e selecionando pela chave (plant) e descarregando aqui todos os dados dela
        hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
      }
    })
    .sort((a, b) => // v4 1:19 organizando as plantas
      Math.floor(
        new Date(a.dateTimeNotification).getTime() / 1000 - 
        Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
      )
    );

    return plantsSorted; 

  }catch(error) { // ta pegando o erro /v4 1:07:25
    throw new Error(error);
  }
}

// excluir planta v5 25:10
export async function removePlant(id: string): Promise<void> { 
  const data = await AsyncStorage.getItem('@plantmanager:plants'); // recuperamos as plantas

  const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}; // fazemos esse tratamento para verificar se tem algo ou não

  delete plants[id]; // pegamos o Id da planta que queremos remover e removemos da coleção // deleta a planta
            
  await AsyncStorage.setItem( // salva ela novamente
    '@plantmanager:plants',
    JSON.stringify(plants)
  ); 
}
