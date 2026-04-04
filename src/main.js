import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import i18next from 'i18next'
import state from './state.js'
import view from './view.js'
import createApp from './app.js'
import resources from './locales.js'

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input[name="url"]'),
  submitButton: document.querySelector('button[type="submit"]'),
  feedback: document.querySelector('.feedback'),
}

const init = () => {
  const i18n = i18next.createInstance()

  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    view(state, elements, i18n)

    const { handleSubmit } = createApp()

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const url = elements.input.value

      handleSubmit(url)
        .then(() => {
          elements.form.reset()
          elements.input.focus()
        })
        .catch(() => {
          elements.input.focus()
        })
    })
  })
}

init()
