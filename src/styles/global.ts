import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${(props) =>
      props.theme[
        'green-500'
      ]} /* 0 na direita, 0 na esquerda, 0 de blur e 2px de tamanho */
  }

  body {
    background: ${(props) => props.theme['gray-900']};
    color: ${(props) => props.theme['gray-300']};
    -webkit-font-smoothing: antialiased;
  }
  
  body, input, textarea, button {
    font-family: Roboto, sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }
`
