import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from 'react'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrentCycleAsFinished: () => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

// {} as CyclesContextType -> para tipar o contexto
export const CyclesContext = createContext({} as CyclesContextType)

// ReactNode -> qualquer HTML ou JSX válido
interface CyclesContextProviderProps {
  children: ReactNode
}

// Componente responsável por
export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState

  /* 
    Percorrer o vetor de ciclos e encontrar um ciclo em que o ID do ciclo seja
    igual ao ID do ciclo ativo
  */
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // O tanto de segundos que já se passaram desde quando o ciclo está ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    // @nomeDaAplicação:nomeDaInformação-1.0.0
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
