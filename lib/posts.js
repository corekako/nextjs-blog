import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
	// get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory)
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
		if (a.date < b.date) {
			return 1
		}
		return -1
	})
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory)

	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       id: 'pre-rendering'
	//     }
	//   }
	// ]
	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ''),
			},
		}
	})
}

export async function getPostData(id) {
	const fullPath = path.join(postsDirectory, `${id}.md`)
	const fileContents = fs.readFileSync(fullPath, 'utf8')

	const matterResult = matter(fileContents)

	// convert markdown into HTML string
	const processedContent = await remark()
		.use(html)
		.process(matterResult.content)
	const contentHtml = processedContent.toString()

	return {
		id,
		contentHtml,
		...matterResult.data,
	}
}
