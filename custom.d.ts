// quando a gente tiver qualquer arquivo que termine com a extensão .png
// fazendo isso ele reconhece o arquivo e para de dar erro.

declare module '*.png' {
  const content: any;
  export default content;
}