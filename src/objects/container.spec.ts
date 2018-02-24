import { test } from 'ava'
import { Container } from 'cohosting-node'

let container = new Container('/one','two','three','four')

test('Container:object', t => {
  t.deepEqual(Object.keys(container).length, 4)
})

test('Container:name', t => {
  t.deepEqual(container.name, 'one')
})
