// Arquivo de definição de tipos

// Importando o styled-components porque irei apenas sobrescrever o que já está feito
import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Guardando os valores inferidos pelo Typescript dentro da variável ThemeType
type ThemeType = typeof defaultTheme

/* 
  Criando uma tipagem para o módulo styled-components
  Toda vez que o styled-components for exportado em algum arquivo, a tipagem que ele irá puxar é o que for definido aqui 
*/
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
