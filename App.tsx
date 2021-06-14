import React from 'react'; // Começamos importando o React.
import AppLoading from 'expo-app-loading'; // Para garantir que enquanto as fontes n forem carregadas, vamos ficar na tela de splash para depois sim carregar a página.

//import { Welcome } from './src/pages/Welcome';
import Routes from './src/routes'; // por padrao ele vai procurar por index, já que eu nao disse o nome do arquivo
import {
  useFonts, //load das fontes
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
// o arquivo App fica como redirecionador, para que tela vamos...

// No App usei o default pois por padrao preciso usar para o REACT conseguir achar ele.
// Mas nas outras páginas eu não preciso usar.
export default function App() { // Exportando a function App.
  const [ fontsLoaded ] = useFonts({ // Estou passando dentro desse objeto as fontes que eu quero usar. Antes do carregamento do app.
    Jost_400Regular,
    Jost_600SemiBold
  });

  if(!fontsLoaded)
    return <AppLoading />
    

  return (     
    <Routes />
  )
}




