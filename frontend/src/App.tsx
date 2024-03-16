import { ChangeEvent, useCallback, useState } from 'react'

function App() {
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    cpf: '',
    step: 1,
  })

  const handleChangeForm = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setSignupForm((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const nextStep = useCallback(() => {
    setSignupForm((prev) => ({ ...prev, step: prev.step + 1 }))
  }, [])
  const previousStep = useCallback(() => {
    setSignupForm((prev) => ({ ...prev, step: prev.step - 1 }))
  }, [])

  return (
    <>
      <div className="step">Step {signupForm.step}</div>
      {signupForm.step === 1 && (
        <>
          <div>
            <input type="checkbox" className="is-passenger" id="is-passenger" />
            <label htmlFor="is-passenger">Passageiro</label>
          </div>
          <div>
            <input type="checkbox" className="is-driver" id="is-driver" />
            <label htmlFor="is-driver">Motorista</label>
          </div>
        </>
      )}
      {signupForm.step === 2 && (
        <>
          <div>
            <input
              name="name"
              type="text"
              className="input-name"
              onChange={handleChangeForm}
              value={signupForm.name}
            />
          </div>
          <div>
            <input
              name="email"
              type="text"
              className="input-email"
              onChange={handleChangeForm}
              value={signupForm.email}
            />
          </div>
          <div>
            <input
              name="cpf"
              type="text"
              className="input-cpf"
              onChange={handleChangeForm}
              value={signupForm.cpf}
            />
          </div>
        </>
      )}
      {signupForm.step > 1 && (
        <button className="previous-button" onClick={previousStep}>
          Previous
        </button>
      )}
      {signupForm.step < 3 && (
        <button className="next-button" onClick={nextStep}>
          Next
        </button>
      )}
      {signupForm.step === 3 && (
        <>
          <div className="name">{signupForm.name}</div>
          <div className="email">{signupForm.email}</div>
          <div className="cpf">{signupForm.cpf}</div>
        </>
      )}
    </>
  )
}

export default App
