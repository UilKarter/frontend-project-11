import { subscribe } from 'valtio/vanilla'

export default (state, elements, i18n) => {
  const { input, submitButton, feedback } = elements

  const updateInputState = (type, message) => {
    input.classList.remove('is-invalid', 'is-valid')
    feedback.classList.remove('text-danger', 'text-success')
    feedback.textContent = ''

    if (type === 'error') {
      input.classList.add('is-invalid')
      feedback.classList.add('text-danger')
      feedback.textContent = message
    }

    if (type === 'success') {
      input.classList.add('is-valid')
      feedback.classList.add('text-success')
      feedback.textContent = message
    }
  }

  const render = () => {
    const { state: formState, error } = state.form
    const isProcessing = formState === 'processing'

    switch (formState) {
      case 'failed':
        updateInputState('error', i18n.t(error ?? 'errors.unknown'))
        break
      case 'success':
        updateInputState('success', i18n.t('form.success'))
        break
      default:
        updateInputState(null, '')
    }

    input.disabled = isProcessing
    submitButton.disabled = isProcessing
  }

  render()
  subscribe(state, render)
}
