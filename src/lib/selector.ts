import * as readlineSync from 'readline-sync'

import { Choice } from '../objects/choice'

export class Selector {
  public static builder (question: string, choices: Array<Choice>) {
    let values = choices.map((el) => {
      let o = Object.assign({}, el)
      return o.name.toUpperCase()
    })
    let index = readlineSync.keyInSelect(values, question)
    if (index === -1) { process.exit() }
    return choices[index].value
  }

  public static inline (question: string) {
    let response = readlineSync.question('\n' + question + ' ')
    return response
  }

  public static YNQuestion (question: string) {
    return readlineSync.keyInYN('\n' + question + ' ')
  }
}
