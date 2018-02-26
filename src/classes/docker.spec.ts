import { test } from 'ava'
import { Docker } from 'cohosting-node'

let docker = new Docker()

test('Class is correct', async t => {
  t.deepEqual(docker instanceof Docker, true)
})
