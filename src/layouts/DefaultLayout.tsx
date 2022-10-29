import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function DefaultLayout() {
  return (
    <div>
      <Header />
      {/* Onde vai ocorrer a transição das páginas */}
      <Outlet />
    </div>
  )
}
