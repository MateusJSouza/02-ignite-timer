import { HandPalm, Play } from 'phosphor-react'
import { createContext, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { FormProvider, useForm } from 'react-hook-form'

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
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrentCycleAsFinished: () => void
}

// {} as CyclesContextType -> para tipar o contexto
export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  // o valor do id ativo do ciclo pode ser uma string ou nulo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // O tanto de segundos que já se passaram desde quando o ciclo está ativo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
      .number()
      .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
  })

  /*
    type -> criar uma tipagem a partir de outra referência
    infer -> inferindo algo definido automaticamente
    Utilizo o typeof sempre que quero referenciar uma variável javascript dentro do typescript
  */
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

  /*
      Register é uma função que vai adicionar um input ao formulário.
      Essa função retorna vários métodos, como onChange, onBlur...
    */
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

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

  function handleCreateNewCycle(data: NewCycleFormData) {
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

    reset() // limpa os campos pro valor original, ou seja, os valores de defaultValues
  }

  function handleInterruptCycle() {
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

  // Observar os campos do formulário com o método watch
  const task = watch('task')
  // Desabilitando o submit enquanto a task não for digitada -> Mais legibilidade ao código
  const isSubmitDisabled = !task

  /**
   * Prop Drilling -> Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes
   * Context API -> Permite compartilharmos informações entre VÁRIOS componentes ao mesmo tempo
   */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          {/* Herda as propripedades do newCycleForm para o FormProvider */}
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
