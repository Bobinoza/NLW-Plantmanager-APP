import React, { useEffect, useState } from 'react'; // useEffect é um hook do react que é carregado antes da tela ser exibida.
import { 
  View,
  Text,
  StyleSheet,
  FlatList, // usado para renderizar listas na tela
  ActivityIndicator // é um load, vou usar no botao de load da lista
} from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';


import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load'; // Para lidar com o Load, vamos criar um estado.
import { useNavigation } from '@react-navigation/core'; // v4 32:44
import { PlantProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


//interface para tipar o que vem lá de dentro
interface EnviromentProps {
  key: string;
  title: string;
}


export function PlantSelect() {
  const [enviroments, setEnvirtoments] = useState<EnviromentProps[]>([]); // <EnviromentProps[]> estou dizendo que vou receber da api esse tipo // [] estou dizendo que ele é uma coleção, um vetor do tipo da interface... 53:50 v3
  const [plants, setPlants] = useState<PlantProps[]>([]); // PlantProps está vindo da interface PlantProps a qual está tipando os dados do server.json
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]); // 1:16 v3 filtro criando um estado auxiliar para não ter que solicitar toda hora para API
  const [enviromentSelected, setEnviromentSelected] = useState('all');//Por padrao o all vai estar ativo // Para saber qual ambiente foi selecionado pelo usuário
  const [loading, setLoading] = useState(true); // por padrao vai estar carregando // loading para saber se está carregando

  const [page, setPage] = useState(1); // paginação 1:26:10 +- v3
  const [loadingMore, setLoadingMore] = useState(false); // para saber se tem mais coisas para carregar paginação

  const navigation = useNavigation(); //v4 32:44

  function handleEnrivomentSelected(environment: string) { // 1:15 v3 função para mudar de botao selecionado no Todos, banheiro, cozinha...
    setEnviromentSelected(environment);

    if(environment == 'all')
      return setFilteredPlants(plants);

    const filtered = plants.filter(plant =>
      plant.environments.includes(environment) // verifica se lá no ambiente da plant, tem incluso esse ambiente aqui: environment
    );

    setFilteredPlants(filtered); // Se tiver, vai armazenar aqui. 1:18 V3
  }

  async function fetchPlants() { // criei uma função, para usar o async, pois a busca na api pode demorar, então eu uso o await pra aguardar a api devolver os dados que eu preciso
    const { data } = await api // {data} desestruturou  // vamos consumir da api o 'plants'
    .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`); // _sort vai ser pelo nome & _order vai ser =asc   (ordem alfabética) //_page=${page} adicionando em que página estou, para pagination // &_limit=8 trazer da api 8 por página
    if(!data) // se não tem nada, faz um return no setLoading(true) (já carregou tudo)
      return setLoading(true)
  
    if(page > 1) { // se a página for maior do que 1, vou pegar o setPlants e vou pegar o oldValue q eu consigo recuperar o valor anterior, os dados armazenados anteriormente no meu estado e recuperar essas informações.
      setPlants(oldValue => [...oldValue, ...data]) // fazendo a junção do ...oldValue com o novo dado ...data // Estou pegando os dados que estavam antes e juntando com o que está chegando agora de dados
      setFilteredPlants(oldValue => [...oldValue, ...data]) // fazendo a mesma coisa para as plantas filtradas.
    }else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false); // Após carregar, O Loading some. Vai ser usado para mostrar a animação de carregamento
    setLoadingMore(false); // Vai ser usado para outra animação de rolagem
  }

  function handleFetchMore(distance: number) { // função para que quando o usuário chegar no final da rolagem, chamar mais dados (paginação)
    if(distance < 1) // se a distance for menor que 1, quer dizer que a rolagem ta sendo pra cima, n precisa carregar mais...
      return;

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants(); // chamando a função
  } 

  function handlePlantSelect(plant: PlantProps) { //v2 32:00
    navigation.navigate('PlantSave', { plant }); // 'PlantSave nome da interface que estamos chamando / quero ir... // , { plant } além de tar passando a rota, agora eu estou passando os dados... v4 41:40
  }

  useEffect(() => {
    async function fetchEnviroment() { // criei uma função, para usar o async, pois a busca na api pode demorar, então eu uso o await pra aguardar a api devolver os dados que eu preciso
      const { data } = await api
      .get('plants_environments?_sort=title&_order=asc'); // {data} desestruturou // vamos consumir da api o 'plants_environments' // ?_sort=title&_order=asc v3 1:12 +- explicação de como por em ordem alfabética
      setEnvirtoments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data // v3 55:50 
      ]);
    }

    fetchEnviroment(); // chamando a funcao. 50:00 v3
  },[])

  useEffect(() => {
    

    fetchPlants(); // chamando a funcao. 50:00 v3
  },[])

  if(loading) // se o loading for verdadeiro, vai retornar o <Load />
    return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          Você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList 
          data={enviroments}
          keyExtractor={(item) => String(item.key)} //vai extrair do nosso item um item.key v4 19:55
          renderItem={({item}) => ( // desestruturando um item
            <EnviromentButton 
              title={item.title} 
              active={item.key === enviromentSelected} // o item.key é igual o item que está lá dentro do enviromentSelected? se for vai ficar marcado
              onPress={() => handleEnrivomentSelected(item.key)} // quando pressionado, vai chamar a função handleEnrivomentSelected 
            />
          )}
          horizontal // para ficar um item ao lado do outro
          showsHorizontalScrollIndicator={false} // para a barrinha de rolagem n aparecer
          contentContainerStyle={styles.enviromentList} // Para estilizar a lista, precisamos usar o contentContainerStyle.
        />
      </View>

      <View style={styles.plants}>
        <FlatList 
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => ( // função anônima que vai retornar nosso elemento // desestruturei o item e depois passei ele pra data={}
            <PlantCardPrimary 
              data={item} 
              onPress={() => handlePlantSelect(item)} // v4 31:40 estou passando pra ela o item que está selecionado
            />
          )}
          showsVerticalScrollIndicator={false} // removendo barra de scroll, ocultando
          numColumns={2} // agora a lista vai ser renderizada em duas colunas (tive que reicinar o app para aparecer.)
          onEndReachedThreshold={0.1} // estou dizendo: quando o usuário chegar em 10% do final da tela
          onEndReached={({ distanceFromEnd }) => // dizendo o que eu vou fazer após chegar em 10% do final da tela
            handleFetchMore(distanceFromEnd) // vai chamar a função handleFetchMore e passar o distanceFromEnd // 1:33 v3
          }
          ListFooterComponent={
            loadingMore // para que o loading só apareça quando tiver algo para carregar. // v3 1:34 +-
            ? <ActivityIndicator color={colors.green} />
            : <></> // ? : true false.. Coloquei os fragments para que o loading suma após o carregamento dos itens vindos da API
          }

        />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 30
  },

  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },

  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },

  enviromentList: { // estilizando a lista
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },

});