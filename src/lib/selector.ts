import * as readlineSync from 'readline-sync'
import { Choice } from '../objects/choice'

export function builder (question: string, choices: Array<Choice>) {
  let values = choices.map((el) => {
    let o = Object.assign({}, el)
    return o.name.toUpperCase()
  })
  let index = readlineSync.keyInSelect(values, question)
  if (index === -1) { process.exit() }
  return choices[index].value
}

export function inline (question: string) {
  var response = readlineSync.question("\n"+question+" ");
  return response
}
