import { test } from 'ava'
import { Choice } from 'cohosting-node'

let choice = new Choice('name','value')

test('Choice:object', t => {
  t.deepEqual(Object.keys(choice).length, 2)
})

test('Choice:key', t => {
  t.deepEqual(choice.name, 'name')
})

test('Choice:value', t => {
  t.deepEqual(choice.value, 'value')
})
