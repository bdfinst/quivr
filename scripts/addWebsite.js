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
  const brain = data.brains.filter(
    brain => brain.name.toLowerCase() === 'demo'
  )[0]

  console.log(brain)
  return brain.id
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

const getMarkdownFiles = async (org, repo) => {
  try {
    const apiUrl = `https://api.github.com/repos/${org}/${repo}/contents`
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch data from GitHub API')
    }
    const data = await response.json()

    const markdownFiles = data.filter(file => file.name.endsWith('.md'))

    return markdownFiles
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const fetchFiles = async (org, repo, path = '') => {
  const apiUrl = `https://api.github.com/repos/${org}/${repo}/contents/${path}`
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from GitHub API: ${response.statusText}`
    )
  }
  return response.json()
}

const findMarkdownFiles = async (org, repo, path = '') => {
  let markdownFiles = []
  const files = await fetchFiles(org, repo, path)

  for (const file of files) {
    if (
      file.type === 'file' &&
      file.name.includes('adr') &&
      file.name.endsWith('.md')
    ) {
      markdownFiles.push(file.path)
    } else if (file.type === 'dir') {
      const subdirectoryFiles = await findMarkdownFiles(org, repo, file.path)
      markdownFiles = markdownFiles.concat(subdirectoryFiles)
    }
  }

  return markdownFiles
}

const getAdrs = async (org, repo) => {
  try {
    const markdownFiles = await findMarkdownFiles(org, repo, 'adr')
    if (markdownFiles.length > 0) {
      console.log('Markdown files containing "adr":')
      markdownFiles.forEach(file => console.log(file))
    } else {
      console.log('No Markdown files containing "adr" found.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
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

const adrs = [{ org: 'defenseunicorns', repo: 'zarf' }]

adrs.forEach(adr => {
  getAdrs(adr.org, adr.repo)
})
