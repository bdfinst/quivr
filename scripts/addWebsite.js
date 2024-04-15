import dotenv from 'dotenv'
import fetch from 'node-fetch'
import puppeteer from 'puppeteer'

dotenv.config()

const api = 'http://localhost:5050'
const apiKey = process.env.QUIVR_API_KEY

const getBrain = async () => {
  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  }

  const response = await fetch(`${api}/brains/`, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = await response.json()

  console.log(data.brains[1])
  return data.brains[1].id
}

const findSubPages = async url => {
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

const addContent = async url => {
  const body = {
    url: url,
  }

  const brain = await getBrain()

  const response = await fetch(`${api}/crawl?brain_id=${brain}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  console.log(response.json().data)
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
