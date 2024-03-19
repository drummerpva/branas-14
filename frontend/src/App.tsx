import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { AccountGateway } from './infra/gateway/AccountGateway'

type AppProps = {
  accountGateway: AccountGateway
}

function App({ accountGateway }: AppProps) {
  const [signupForm, setSignupForm] = useState({
    form: {
      name: '',
      email: '',
      cpf: '',
      step: 1,
      carPlate: '',
      isPassenger: false,
      isDriver: false,
    },
  })
  const [accountId, setAccountId] = useState('')
  const [error, setError] = useState('')

  const handleChangeForm = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = event.target
      if (name === 'isPassenger' || name === 'isDriver') {
        setSignupForm((prev) => ({ form: { ...prev.form, [name]: checked } }))
        return
      }
      setSignupForm((prev) => ({ form: { ...prev.form, [name]: value } }))
    },
    [],
  )

  const nextStep = useCallback(() => {
    setSignupForm((prev) => {
      if (
        prev.form.step === 1 &&
        !prev.form.isPassenger &&
        !prev.form.isDriver
      ) {
        setError('Select at least one option')
        return prev
      }
      if (prev.form.step === 2) {
        if (!prev.form.name) {
          setError('Invalid name')
          return prev
        }
        if (!prev.form.email) {
          setError('Invalid email')
          return prev
        }
        if (!prev.form.cpf) {
          setError('Invalid CPF')
          return prev
        }
        if (prev.form.isDriver && !prev.form.carPlate) {
          setError('Invalid car plate')
          return prev
        }
      }
      setError('')
      return { form: { ...prev.form, step: prev.form.step + 1 } }
    })
  }, [])
  const previousStep = useCallback(() => {
    setSignupForm((prev) => ({
      form: { ...prev.form, step: prev.form.step - 1 },
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const input = signupForm
    const output = await accountGateway.signup(input)
    setAccountId(output.accountId)
    nextStep()
  }, [nextStep, signupForm, accountGateway])

  const isNextButtonVisible = useMemo(() => {
    return signupForm.form.step < 3
  }, [signupForm])
  const isPreviousButtonVisible = useMemo(() => {
    return signupForm.form.step > 1 && signupForm.form.step < 4
  }, [signupForm])
  const isSubmitButtonVisible = useMemo(() => {
    return signupForm.form.step === 3
  }, [signupForm])

  return (
    <>
      <div className="step">Step {signupForm.form.step}</div>
      {signupForm.form.step === 1 && (
        <>
          <div>
            <input
              type="checkbox"
              className="is-passenger"
              id="is-passenger"
              name="isPassenger"
              checked={signupForm.form.isPassenger}
              onChange={handleChangeForm}
            />
            <label htmlFor="is-passenger">Passageiro</label>
          </div>
          <div>
            <input
              type="checkbox"
              className="is-driver"
              id="is-driver"
              name="isDriver"
              checked={signupForm.form.isDriver}
              onChange={handleChangeForm}
            />
            <label htmlFor="is-driver">Motorista</label>
          </div>
        </>
      )}
      <br />
      {signupForm.form.step === 2 && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              className="input-name"
              onChange={handleChangeForm}
              value={signupForm.form.name}
              placeholder="Name"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              className="input-email"
              onChange={handleChangeForm}
              value={signupForm.form.email}
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="cpf">CPF</label>
            <input
              name="cpf"
              type="text"
              className="input-cpf"
              onChange={handleChangeForm}
              value={signupForm.form.cpf}
              placeholder="CPF"
            />
          </div>
          {signupForm.form.isDriver && (
            <div>
              <label htmlFor="carPlate">Car Plate</label>
              <input
                name="carPlate"
                type="text"
                className="input-car-plate"
                onChange={handleChangeForm}
                value={signupForm.form.carPlate}
                placeholder="Car Plate"
              />
            </div>
          )}
        </>
      )}
      <br />
      {isSubmitButtonVisible && (
        <>
          <div className="name">Name: {signupForm.form.name}</div>
          <div className="email">Email: {signupForm.form.email}</div>
          <div className="cpf">CPF: {signupForm.form.cpf}</div>
          {signupForm.form.isDriver && (
            <div className="car-plate">
              Car plate: {signupForm.form.carPlate}
            </div>
          )}
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </>
      )}
      {signupForm.form.step === 4 && !!accountId.length && (
        <>
          <div className="account-id">{accountId}</div>
        </>
      )}
      {isPreviousButtonVisible && (
        <button className="previous-button" onClick={previousStep}>
          Previous
        </button>
      )}
      {isNextButtonVisible && (
        <button className="next-button" onClick={nextStep}>
          Next
        </button>
      )}
      {!!error.length && <div className="error">{error}</div>}
    </>
  )
}

export default App
