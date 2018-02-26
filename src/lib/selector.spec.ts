import { test } from 'ava'
import { Selector } from 'cohosting-node'

let selector = new Selector()

test('Class is correct', async t => {
  t.deepEqual(selector instanceof Selector, true)
})
