import React from 'react';
import {
  StyleSheet,
  Text,

} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'; // outra opção de fazer um botão //RectButtonProps Já vem com ele os efeitos de cada plataforma Ios / Android efeitos de movimento.
import { color } from 'react-native-reanimated';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnviromentButtonProps extends RectButtonProps {
  title: string;
  active?: boolean; //? quer dizer que não é obrigatório passar o active.
}

export function EnviromentButton ({
  title,
  active = false, // por padrao vai ser false.
  ...rest // pra pegar tudo que sobrar do botão
} : EnviromentButtonProps) {
  return(
    <RectButton
      style={[ // ocumulando estilos. {[]}
        styles.container,
        active && styles.containerActive // se for ativo (active) adicionar styles.containerActive..(vai adicionar o styles.containerActive se for ativo)
      ]}
      {...rest}
    >
      <Text style={[
          styles.text,
          active && styles.textActive
        ]}
      >
        { title }
      </Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: { // container para o botao nao ativo
    backgroundColor: colors.shape,
    width: 76,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5
  },

  containerActive: { // para o botao ativo
    backgroundColor: colors.green_light
  },

  text: {
    color: colors.heading,
    fontFamily: fonts.text,
  },

  textActive: {
    fontFamily: fonts.heading,
    color: colors.green_dark,
  }
})