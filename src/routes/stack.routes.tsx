import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import colors from '../styles/colors';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';
import { MyPlants } from '../pages/MyPlants';
import AuthRoutes from './tab.routes';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => ( // react functional component, estou tipando esse componente de navegação
  <stackRoutes.Navigator
    headerMode="none" // n vai aparecer o header
    screenOptions={{ // quer q a cor do app padrao seja branca no fundo.
      cardStyle: {
        backgroundColor: colors.white
      }
    }}
  >

    <stackRoutes.Screen  // Vai abrir primeiro essa tela, pois ela está antes das outras.
      name="Welcome" // quando alguém chamar por esse nome de tela
      component={Welcome} // devolva esse componente
    />

    <stackRoutes.Screen 
      name="UserIdentification" // quando alguém chamar por esse nome de tela
      component={UserIdentification} // devolva esse componente
    />

    <stackRoutes.Screen 
      name="Confirmation"
      component={Confirmation}
    />

    <stackRoutes.Screen 
      name="PlantSelect"
      component={AuthRoutes}
    />

    <stackRoutes.Screen 
      name="PlantSave"
      component={PlantSave}
    />

    <stackRoutes.Screen 
      name="MyPlants"
      component={AuthRoutes}
    />

  </stackRoutes.Navigator>
)

export default AppRoutes;