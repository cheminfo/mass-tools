import { readFileSync } from "fs"
import { join } from "path"

import { includeDBRefs } from "../includeDBRefs.js"

test('includeDBRefs', async () => {
  const object = JSON.parse(readFileSync(join(__dirname, 'details.json'), 'utf8'))
  let nbPatents = object.data.patents.filter(patent => patent.data).length
  expect(nbPatents).toBe(18)
  await includeDBRefs(object, { collections: ['patents'] })
  nbPatents = object.data.patents.filter(patent => patent.data).length
  expect(nbPatents).toBe(23)
})
