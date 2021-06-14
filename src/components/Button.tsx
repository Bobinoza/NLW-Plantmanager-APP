import React from 'react';
import { 
  Text, 
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  ButtonProps
} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonsProps extends TouchableOpacityProps { // tipando o botão // ButtonsProps tem as propriedades que eu quiser por ex: title... e eu extende todas as caracteristicas de um TouchableOpacityProps
  title: string;
}

export function Button({ title, ...rest }: ButtonProps ) { // {title}: ButtonProps estou dizendo que o tipo do componente é um ButtonProps   ...rest está pegando todas as otras propriedades que vem de dentro do TouchableOpacityProps
  return (
    <TouchableOpacity 
      style={styles.container}
      {...rest} // estou passando as propriedades do TouchableOpacity para o botao.
    >
      <Text style={styles.text}>
        { title } 
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.heading
  }
});