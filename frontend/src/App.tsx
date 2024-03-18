import { ChangeEvent, useCallback, useState } from 'react'

function App() {
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    cpf: '',
    step: 1,
    carPlate: '',
    isPassenger: false,
    isDriver: false,
  })
  const [accountId, setAccountId] = useState('')
  const [error, setError] = useState('')

  const handleChangeForm = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = event.target
      if (name === 'isPassenger' || name === 'isDriver') {
        setSignupForm((prev) => ({ ...prev, [name]: checked }))
        return
      }
      setSignupForm((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const nextStep = useCallback(() => {
    setSignupForm((prev) => {
      if (prev.step === 1 && !prev.isPassenger && !prev.isDriver) {
        setError('Select at least one option')
        return prev
      }
      if (prev.step === 2) {
        if (!prev.name) {
          setError('Invalid name')
          return prev
        }
        if (!prev.email) {
          setError('Invalid email')
          return prev
        }
        if (!prev.cpf) {
          setError('Invalid CPF')
          return prev
        }
        if (prev.isDriver && !prev.carPlate) {
          setError('Invalid car plate')
          return prev
        }
      }
      setError('')
      return { ...prev, step: prev.step + 1 }
    })
  }, [])
  const previousStep = useCallback(() => {
    setSignupForm((prev) => ({ ...prev, step: prev.step - 1 }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      body: JSON.stringify(signupForm),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    setAccountId(data.accountId)
    nextStep()
  }, [nextStep, signupForm])

  return (
    <>
      <div className="step">Step {signupForm.step}</div>
      {signupForm.step === 1 && (
        <>
          <div>
            <input
              type="checkbox"
              className="is-passenger"
              id="is-passenger"
              name="isPassenger"
              checked={signupForm.isPassenger}
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
              checked={signupForm.isDriver}
              onChange={handleChangeForm}
            />
            <label htmlFor="is-driver">Motorista</label>
          </div>
        </>
      )}
      <br />
      {signupForm.step === 2 && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              className="input-name"
              onChange={handleChangeForm}
              value={signupForm.name}
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
              value={signupForm.email}
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
              value={signupForm.cpf}
              placeholder="CPF"
            />
          </div>
          {signupForm.isDriver && (
            <div>
              <label htmlFor="carPlate">Car Plate</label>
              <input
                name="carPlate"
                type="text"
                className="input-car-plate"
                onChange={handleChangeForm}
                value={signupForm.carPlate}
                placeholder="Car Plate"
              />
            </div>
          )}
        </>
      )}
      <br />
      {signupForm.step === 3 && (
        <>
          <div className="name">Name: {signupForm.name}</div>
          <div className="email">Email: {signupForm.email}</div>
          <div className="cpf">CPF: {signupForm.cpf}</div>
          {signupForm.isDriver && (
            <div className="car-plate">Car plate: {signupForm.carPlate}</div>
          )}
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </>
      )}
      {signupForm.step === 4 && !!accountId.length && (
        <>
          <div className="account-id">{accountId}</div>
        </>
      )}
      {signupForm.step > 1 && signupForm.step < 4 && (
        <button className="previous-button" onClick={previousStep}>
          Previous
        </button>
      )}
      {signupForm.step < 3 && (
        <button className="next-button" onClick={nextStep}>
          Next
        </button>
      )}
      {!!error.length && <div className="error">{error}</div>}
    </>
  )
}

export default App
