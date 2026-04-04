import axios from 'axios'
import state from './state.js'
import buildSchema from './validator.js'
import parseRss from './parser.js'
import getId from './getId.js'

const normalizeUrl = value => value.trim()
const getProxyUrl = () => 'https://allorigins.hexlet.app/get'

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
  if (error?.message?.startsWith('errors.')) {
    return error.message
  }

  if (axios.isAxiosError(error)) {
    return 'errors.network'
  }

  return 'errors.unknown'
}

export default () => {
  const validate = (url) => {
    const exUrls = state.feeds.map(feed => feed.url)
    return buildSchema(exUrls).validate(url)
  }

  const handleSubmit = (rawUrl) => {
    const url = normalizeUrl(rawUrl)

    state.process.phase = 'loading'
    state.process.errorCode = null

    let validatedUrl

    return validate(url)
      .then((validUrl) => {
        validatedUrl = validUrl
        return fetchRss(validatedUrl)
      })
      .then(response => parseRss(response.data.contents))
      .then((feedData) => {
        addFeedWithPosts(validatedUrl, feedData)

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
