import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
	// get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory)
	// console.log('fileNames: ', fileNames, postsDirectory)
	const allPostsData = fileNames.map((fileName) => {
		// remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '')

		// read markdown file as string
		const fullPath = path.join(postsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		// parse the post metadata section
		const matterResult = matter(fileContents)

		return { id, ...matterResult.data }
	})

	return allPostsData.sort((a, b) => {
		console.log(a.date, b.date)
		if (a.date < b.date) {
			return 1
		}
		return -1
	})
}
