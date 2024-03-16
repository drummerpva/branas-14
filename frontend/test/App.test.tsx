import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

test('Deve testar o componente de signup', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const { container } = render(<App />)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
  container.querySelector('.is-passenger')?.setAttribute('checked', 'true')
  container.querySelector('.is-driver')?.setAttribute('checked', 'false')
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  await userEvent.type(
    container.querySelector('.input-name')!,
    inputSignupPassenger.name,
  )
  await userEvent.type(
    container.querySelector('.input-email')!,
    inputSignupPassenger.email,
  )
  await userEvent.type(
    container.querySelector('.input-cpf')!,
    inputSignupPassenger.cpf,
  )
  await userEvent.click(container.querySelector('.next-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 3')
  expect(container.querySelector('.name')?.innerHTML).toBe(
    inputSignupPassenger.name,
  )
  expect(container.querySelector('.email')?.innerHTML).toBe(
    inputSignupPassenger.email,
  )
  expect(container.querySelector('.cpf')?.innerHTML).toBe(
    inputSignupPassenger.cpf,
  )
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 2')
  await userEvent.click(container.querySelector('.previous-button')!)
  expect(container.querySelector('.step')?.innerHTML).toBe('Step 1')
})
