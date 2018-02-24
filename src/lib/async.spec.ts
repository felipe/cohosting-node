import { test } from 'ava'
import { asyncABC } from 'cohosting-node'

test('getABC', async t => {
  t.deepEqual(await asyncABC(), ['a','b', 'c'])
})
