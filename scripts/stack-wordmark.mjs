import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = fs.readFileSync(path.join(root, 'public/csc/wordmark-horizontal.svg'), 'utf8')

const iconMatch = src.match(/<g id="Group">[\s\S]*?<\/g>/)
const tagMatch = src.match(/<g id="Group_2">[\s\S]*?<\/g>/)
if (!iconMatch || !tagMatch) {
  console.error('parse fail', Boolean(iconMatch), Boolean(tagMatch))
  process.exit(1)
}

const whiteStart = src.indexOf('<path id="Vector"')
const whiteEnd = src.indexOf('<g id="Group">')
const white = src.slice(whiteStart, whiteEnd).trim()
const icon = iconMatch[0]
const tag = tagMatch[0]

const out = `<svg preserveAspectRatio="xMidYMid meet" overflow="visible" style="display: block;" width="633" height="446" viewBox="0 0 633 446" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="verde e tipografia branca alter">
  <g transform="translate(198.5 12) scale(2.05) translate(-56 -15)">
${icon}
  </g>
  <g transform="translate(43 248) translate(-224 -35)">
${white}
  </g>
  <g transform="translate(70.5 372) scale(1.02) translate(-248 -135)">
${tag}
  </g>
</g>
</svg>
`

fs.writeFileSync(path.join(root, 'public/csc/wordmark.svg'), out)
console.log('wrote stacked wordmark', out.length)
