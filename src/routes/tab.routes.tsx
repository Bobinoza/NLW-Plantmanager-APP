import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import { PlantSelect } from '../pages/PlantSelect';
import { MaterialIcons } from '@expo/vector-icons';
import { MyPlants } from '../pages/MyPlants';

const AppTab = createBottomTabNavigator(); // AppTab está recebendo o createBottomTabVavigator

const AuthRoutes = () => {
  return(
    <AppTab.Navigator 
      tabBarOptions={{
        activeTintColor: colors.green, // quando o botao estiver ativo, fica nessa cor
        inactiveTintColor: colors.heading, // inativo fica assim
        labelPosition: 'beside-icon', // icons um do lado do outro
        style: {
          paddingVertical: 20,
          height: 88
        },
      }}>
        <AppTab.Screen
          name="Nova Planta"
          component={PlantSelect}
          options={{
            tabBarIcon: (({ size, color }) => ( // para pegar size e color de forma dinamica
              <MaterialIcons
                name="add-circle-outline"
                size={size}
                color={color} 
              />
            ))
          }}
        />

        <AppTab.Screen
          name="Minhas Plantas"
          component={MyPlants}
          options={{
            tabBarIcon: (({ size, color }) => ( // para pegar size e color de forma dinamica
              <MaterialIcons
                name="format-list-bulleted"
                size={size}
                color={color} 
              />
            ))
          }}
        />

    </AppTab.Navigator>
    
  )
}

export default AuthRoutes;