import state from './state.js'
import { buildUrlSchema } from './validator.js'

const trim = str => str.trim()
const getFeedUrls = () => state.feeds.map(f => f.url)
const createFeed = url => ({ id: crypto.randomUUID(), url })

export default () => {
  const validator = url => buildUrlSchema(getFeedUrls()).validate(url)

  const handleSubmit = (raw) => {
    state.form.error = null
    state.form.state = 'processing'

    const cleaned = trim(raw)

    return validator(cleaned)
      .then((valid) => {
        state.feeds.push(createFeed(valid))
        state.form.state = 'success'
        return valid
      })
      .catch((err) => {
        state.form.state = 'failed'
        state.form.error = err.message
        throw err
      })
  }

  return { handleSubmit }
}
