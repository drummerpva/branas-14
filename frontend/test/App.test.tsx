import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

test('Deve testar o componente de signup', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456123',
    carPlate: 'ABC1234',
  }
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.is-driver')!)
  await userEvent.click(container.querySelector('.is-passenger')!)
  await userEvent.click(container.querySelector('.next-button')!)
  await userEvent.type(
    container.querySelector('.input-name')!,
    inputSignup.name,
  )
  await userEvent.type(
    container.querySelector('.input-email')!,
    inputSignup.email,
  )
  await userEvent.type(container.querySelector('.input-cpf')!, inputSignup.cpf)
  await userEvent.type(
    container.querySelector('.input-car-plate')!,
    inputSignup.carPlate,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.name')?.innerHTML).toBe(
    `Name: ${inputSignup.name}`,
  )
  expect(container.querySelector('.email')?.innerHTML).toBe(
    `Email: ${inputSignup.email}`,
  )
  expect(container.querySelector('.cpf')?.innerHTML).toBe(
    `CPF: ${inputSignup.cpf}`,
  )
  expect(container.querySelector('.car-plate')?.innerHTML).toBe(
    `Car plate: ${inputSignup.carPlate}`,
  )
  await userEvent.click(container.querySelector('.submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('account-id')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent?.length).toBe(36)
})
test('Deve testar o fluxo do wizard passenger', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
    carPlate: 'ABC1234',
  }
  const { container } = render(<App />)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  await userEvent.click(container.querySelector('.is-passenger')!)
  expect(container.querySelector('.previous-button')).toBeFalsy()
  expect(container.querySelector('.next-button')).toBeInTheDocument()
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  expect(container.querySelector('.previous-button')).toBeInTheDocument()
  expect(container.querySelector('.next-button')).toBeInTheDocument()
  expect(container.querySelector('.input-name')).toBeInTheDocument()
  expect(container.querySelector('.input-email')).toBeInTheDocument()
  expect(container.querySelector('.input-cpf')).toBeInTheDocument()
  expect(container.querySelector('.input-car-plate')).toBeFalsy()
  await userEvent.type(
    container.querySelector('.input-name')!,
    inputSignup.name,
  )
  await userEvent.type(
    container.querySelector('.input-email')!,
    inputSignup.email,
  )
  await userEvent.type(container.querySelector('.input-cpf')!, inputSignup.cpf)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.next-button')).toBeFalsy()
  expect(container.querySelector('.previous-button')).toBeInTheDocument()
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 3')
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
})
test('Deve testar o fluxo do wizard driver', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
    carPlate: 'ABC1234',
  }
  const { container } = render(<App />)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  await userEvent.click(container.querySelector('.is-passenger')!)
  expect(container.querySelector('.previous-button')).toBeFalsy()
  expect(container.querySelector('.next-button')).toBeInTheDocument()
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  expect(container.querySelector('.previous-button')).toBeInTheDocument()
  expect(container.querySelector('.next-button')).toBeInTheDocument()
  expect(container.querySelector('.input-name')).toBeInTheDocument()
  expect(container.querySelector('.input-email')).toBeInTheDocument()
  expect(container.querySelector('.input-cpf')).toBeInTheDocument()
  expect(container.querySelector('.input-car-plate')).toBeFalsy()
  await userEvent.click(container.querySelector('.previous-button')!)
  await userEvent.click(container.querySelector('.is-driver')!)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.input-car-plate')).toBeInTheDocument()
  await userEvent.type(
    container.querySelector('.input-name')!,
    inputSignup.name,
  )
  await userEvent.type(
    container.querySelector('.input-email')!,
    inputSignup.email,
  )
  await userEvent.type(container.querySelector('.input-cpf')!, inputSignup.cpf)
  await userEvent.type(
    container.querySelector('.input-car-plate')!,
    inputSignup.carPlate,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.next-button')).toBeFalsy()
  expect(container.querySelector('.previous-button')).toBeInTheDocument()
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 3')
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
})
test('Não deve ir para o passo 2, se pelo menos uma opção(passenger ou driver) não estiver marcada', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  expect(container.querySelector('.error')?.textContent).toBe(
    'Select at least one option',
  )
})
test('Deve ir para o passo 2 tendo selecionado uma opção', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.is-passenger')!)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
})
test('Deve ir para o passo 2 tendo selecionado uma opção, depois de ter recebido o erro e o erro deve ser apagado', async () => {
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  expect(container.querySelector('.error')?.textContent).toBe(
    'Select at least one option',
  )
  await userEvent.click(container.querySelector('.is-passenger')!)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  expect(container.querySelector('.error')).toBeFalsy()
})
test('Deve ir para o passo 3 se os campos nome, email, cpf e placa do carro(se for motorista) não estiverem preenchidos', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
    carPlate: 'ABC1234',
  }
  const { container } = render(<App />)
  await userEvent.click(container.querySelector('.next-button')!)
  await userEvent.click(container.querySelector('.is-driver')!)
  await userEvent.click(container.querySelector('.is-passenger')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.error')?.textContent).toBe('Invalid name')
  await userEvent.type(
    container.querySelector('.input-name')!,
    inputSignup.name,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.error')?.textContent).toBe('Invalid email')
  await userEvent.type(
    container.querySelector('.input-email')!,
    inputSignup.email,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.error')?.textContent).toBe('Invalid CPF')
  await userEvent.type(container.querySelector('.input-cpf')!, inputSignup.cpf)
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.error')?.textContent).toBe(
    'Invalid car plate',
  )
  await userEvent.type(
    container.querySelector('.input-car-plate')!,
    inputSignup.carPlate,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 3')
  expect(container.querySelector('.error')).toBeFalsy()
})
