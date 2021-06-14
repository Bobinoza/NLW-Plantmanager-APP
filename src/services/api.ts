//nao preciso por .tsx pois eu não vou construir um componente react. Só vou fazer
// uma configuração para consumir uma API

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.34:3333' // dá pra por 'localhost', mas o dispositivo fixo n vai conseguir reconhcer, por isso é melhor usar o ip
})

// porta 3333 que a api vai escutar as requisições.

export default api;