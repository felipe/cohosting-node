import { test } from 'ava'
import { Docker, Clients } from 'cohosting-node'

let docker = new Docker()
let clients = new Clients(docker)

test('Class is correct', async t => {
  t.deepEqual(clients instanceof Clients, true)
})

// test('Should have no current client', async t => {
//   let client = await clients.get()
//   t.deepEqual(client, '')
// })
//
// test('Should have available clients', async t => {
//   let clientsList = await clients.getAvailableHosts()
//   t.deepEqual((clientsList.length > 0), true)
// })
