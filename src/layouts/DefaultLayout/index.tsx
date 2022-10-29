import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutContainer } from './styles'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      {/* Onde vai ocorrer a transição das páginas */}
      <Outlet />
    </LayoutContainer>
  )
}
