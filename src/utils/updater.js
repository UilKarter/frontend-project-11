import axios from 'axios'
import state from './state.js'
import parser from './parser.js'
import getId from './getId.js'

const updInt = 5000

const getProxyUrl = () => 'https://allorigins.hexlet.app/get'

const fetchRss = url => axios.get(getProxyUrl(), {
  params: { disableCache: true, url },
})

const getExsLinks = () => state.posts.map(post => post.link)

const getNewPosts = (feedId, posts) => {
  const exsLinks = getExsLinks()

  const newPosts = posts
    .filter(post => !exsLinks.includes(post.link))
    .map(post => ({
      id: getId(),
      feedId,
      title: post.title,
      description: post.description,
      link: post.link,
    }))

  if (newPosts.length > 0) {
    state.posts.unshift(...newPosts)
  }
}

const updateFeed = feed => (
  fetchRss(feed.url)
    .then(response => parser(response.data.contents))
    .then((data) => {
      getNewPosts(feed.id, data.posts)
    })
    .catch(() => { })
)

const updateFeeds = () => {
  const promises = state.feeds.map(feed => updateFeed(feed))

  Promise.all(promises)
    .finally(() => {
      setTimeout(updateFeeds, updInt)
    })
}

const startAutoUpdate = () => {
  setTimeout(updateFeeds, updInt)
}

export default startAutoUpdate
