const puppeteer = require('puppeteer')

async function findSubPages(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })

  const urls = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'))
    return links.map(link => link.href)
  })

  await browser.close()

  // Filter URLs to include only those that are sub-pages of the initial URL
  const baseHost = new URL(url).host
  const subPages = urls.filter(u => {
    const host = new URL(u, url).host // Second parameter handles relative URLs
    return host === baseHost
  })

  return [...new Set(subPages)] // Remove duplicates
}

const addContent = url => {
  const body = {
    url: url,
  }

  console.log(JSON.stringify(body))
  fetch(
    'http://localhost:5050/crawl?brain_id=7f5bac72-991e-4483-b9ba-84282c0d144a',
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer 539a9466049322081b0023ccd8472d89',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error))
}

const sites = [
  'https://docs.zarf.dev/',
  'https://minimumcd.org/',
  'https://dojoconsortium.org/',
]

sites.forEach(site => {
  findSubPages(site)
    .then(subPages => {
      subPages.sort().forEach(page => {
        if (page.length > 9 && !page.includes('#')) {
          addContent(page)
        }
      })
    })
    .catch(error => {
      console.error('An error occurred:', error)
    })
})
