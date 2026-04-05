import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'
import i18next from 'i18next'
import state from './utils/state.js'
import view from './view.js'
import createApp from './app.js'
import resources from './utils/locales.js'
import startAutoUpdate from './utils/updater.js'

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input[name="url"]'),
  submitButton: document.querySelector('button[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feedsContainer: document.querySelector('.feeds-container'),
  postsContainer: document.querySelector('.posts-container'),
  modalTitle: document.querySelector('#modal .modal-title'),
  modalBody: document.querySelector('#modal .modal-body p'),
  modalFullArticleLink: document.querySelector('#modal .modal-footer a'),
}

const applyTranslations = (i18n) => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n')
    element.textContent = i18n.t(key)
  })
}

const init = () => {
  const i18n = i18next.createInstance()
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    applyTranslations(i18n)
    view(state, elements, i18n)
    startAutoUpdate()
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
