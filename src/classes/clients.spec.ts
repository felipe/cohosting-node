import { test } from 'ava'
import { Docker, Clients } from 'cohosting-node'

let docker = new Docker()
let clients = new Clients(docker)

test('Class is correct', async t => {
  t.deepEqual(clients instanceof Clients, true)
})
