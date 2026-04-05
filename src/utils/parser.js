const parser = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('errors.parseError')
  }

  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('errors.parseError')
  }

  const feedTitle = channel.querySelector('title')?.textContent || 'Без названия'
  const feedDescription = channel.querySelector('description')?.textContent || ''
  const items = doc.querySelectorAll('item')
  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent || 'Без заголовка',
    link: item.querySelector('link')?.textContent || '',
    pubDate: item.querySelector('pubDate')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
  }))

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  }
}

export default parser
