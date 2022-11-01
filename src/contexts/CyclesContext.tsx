import { createContext, ReactNode, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

// Definição do formato dos ciclos
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
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
  const [cycles, setCycles] = useState<Cycle[]>([])

  // o valor do id ativo do ciclo pode ser uma string ou nulo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // O tanto de segundos que já se passaram desde quando o ciclo está ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  /* 
    Percorrer o vetor de ciclos e encontrar um ciclo em que o ID do ciclo seja
    igual ao ID do ciclo ativo
  */
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          }
        } else return cycle
      }),
    )
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    /*
      Adicionndo uma informação no array, copiando todos os ciclos que eu já
      tenho e adicionar o novo ciclo no final.

      Sempre que uma alteração de estado depender do valor anterior, devemos
      usar o formato de arrow function
    */
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    setCycles((state) =>
      // Map -> percorre cada ciclo e retorna cada um dos ciclos alterados ou não
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          }
        } else return cycle
      }),
    )
    setActiveCycleId(null)
  }

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
