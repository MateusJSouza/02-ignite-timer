import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from 'react'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

/*
  type -> criar uma tipagem a partir de outra referência
  infer -> inferindo algo definido automaticamente
  Utilizo o typeof sempre que quero referenciar uma variável javascript dentro do typescript
*/
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

// Definição do formato dos ciclos
interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  // o valor do id ativo do ciclo pode ser uma string ou nulo
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  /*
    Register é uma função que vai adicionar um input ao formulário.
    Essa função retorna vários métodos, como onChange, onBlur...
  */
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    /*
      Adicionndo uma informação no array, copiando todos os ciclos que eu já
      tenho e adicionar o novo ciclo no final.

      Sempre que uma alteração de estado depender do valor anterior, devemos
      usar o formato de arrow function
    */
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset() // limpa os campos pro valor original, ou seja, os valores de defaultValues
  }

  /* 
    Percorrer o vetor de ciclos e encontrar um ciclo em que o ID do ciclo seja
    igual ao ID do ciclo ativo
  */
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  console.log(activeCycle)

  // Observar os campos do formulário com o método watch
  const task = watch('task')
  // Desabilitando o submit enquanto a task não for digitada -> Mais legibilidade ao código
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')} // dando um nome para o input
          />

          {/* Lista de sugestões pro input */}
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            // valueAsNumber: true é para receber o valor como um number e não uma string
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>Minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
