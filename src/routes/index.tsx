import React from 'react';
import { NavigationContainer } from '@react-navigation/native'  // Pra definir como vai ser o container de navegação

import StackRoutes from './stack.routes';

const Routes = () => ( // estou centralizando as telas de StackRoutes dentro de um container de navegação (v2 - 1:21:00)
  <NavigationContainer>
    <StackRoutes />
  </NavigationContainer>
)

export default Routes;