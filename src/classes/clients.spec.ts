import { test } from 'ava'
import { Docker, Clients } from 'cohosting-node'

let docker = new Docker()
let clients = new Clients(docker)

test('Class is correct', t => {
  t.deepEqual(clients instanceof Clients, true)
})

test('Correct `type` is set', async t => {
  t.deepEqual(clients.type, 'clients')
})

test('Should have no current client', async t => {
  let client = await clients.get()
  t.deepEqual(client, '')
})

// test('Should ask for clients', async t => {
//   await clients.set()
// })

test('Should have available clients', async t => {
  clients.current = ''
  let clientsList = await clients.getAvailableClients()
  t.deepEqual((clientsList.length > 0), true)
})

test('Should print available clients', async t => {
  /*
    The test will just clear the list, check its cleared, call the print
    method and check that it once again has entries.
   */
  clients.availableClients = []
  await clients.printAvailableClients()
  t.deepEqual((clients.availableClients.length > 0), true)
})
