import axios from 'axios'
import state from './utils/state.js'
import buildSchema from './utils/validator.js'
import parser from './utils/parser.js'
import getId from './utils/getId.js'
import { normalizeUrl, getProxyUrl } from './utils/urlHandlers.js'

const fetchRss = url => axios.get(getProxyUrl(), {
  params: { disableCache: true, url },
})

const addFeedWithPosts = (url, feedData) => {
  const feedId = getId()
  state.feeds.unshift({
    id: feedId,
    url,
    title: feedData.feed.title,
    description: feedData.feed.description,
  })
  const posts = feedData.posts.map(post => ({
    id: getId(),
    feedId,
    title: post.title,
    description: post.description,
    link: post.link,
  }))
  state.posts.unshift(...posts)
}

const getErrorKey = (error) => {
  if (error?.message?.startsWith('errors.')) return error.message
  if (axios.isAxiosError(error)) return 'errors.network'
  return 'errors.unknown'
}

export default () => {
  const validate = (url) => {
    const existingUrls = state.feeds.map(feed => feed.url)
    return buildSchema(existingUrls).validate(url)
  }

  const handleSubmit = (rawUrl) => {
    state.process.phase = 'loading'
    state.process.errorCode = null
    const url = normalizeUrl(rawUrl)
    return validate(url)
      .then(validatedUrl => fetchRss(validatedUrl))
      .then(response => parser(response.data.contents))
      .then((feedData) => {
        addFeedWithPosts(url, feedData)
        state.process.phase = 'done'
      })
      .catch((error) => {
        state.process.phase = 'error'
        state.process.errorCode = getErrorKey(error)
        throw error
      })
  }

  return { handleSubmit }
}
