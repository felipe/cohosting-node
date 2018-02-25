import * as fs from 'fs-extra'
import * as cmd from 'node-cmd-promise'

import { Choice } from '../objects/choice'

import { Docker } from '../classes/docker'

export class Builds {
  type: string = ''
  docker = Docker

  constructor (docker: Docker, type: string) {
    this.type = type
    this.docker = Docker
  }

  public getAvailableChoices (items: Array<string>) {
    let choices: Array<Choice> = []
    items.forEach(item => {
      choices.push(new Choice(item, item))
    })
    return choices
  }

  public async fetchAvailableBuilds () {
    return new Promise<Array<string>> (resolve => {
      let builds: Array<string> = []
      return fs.readdir('./build/main/docker/' + this.type + '/')
        .then(items => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].charAt(0) !== '.') {
              builds.push(items[i])
            }
          }
          resolve(builds)
        })
        .catch(err => { console.error(err) })
    })
  }

  public async prepareBuild (build: string, name?: string) {
    return new Promise (resolve => {
      return fs.mkdirs('./docker/' + this.getBuildPath(name ? name : build) + '/')
        .then(() => {
          return fs.copy('./build/main/docker/' + this.type + '/' + build, './docker/' + this.getBuildPath(name ? name : build) + '/')
        })
        .then(() => { resolve() })
        .catch(err => { console.error(err) })
    })
    .catch(err => { console.error(err) })
  }

  public async performBuild (build: string, name?: string) {
    return new Promise (resolve => {
      return cmd('cd ./docker/' + this.getBuildPath(name ? name : build) + '/ && docker-compose up -d')
        .then(stdout => {
          if (name) {
            console.log('\n' + build + ' `' + name + '` has been built.')
          } else {
            console.log('\n' + this.type + ' `' + build + '` has been built.')
          }
        })
        .then(() => { resolve() })
        .catch(err => { console.error(err) })
    })
    .catch(err => { console.error(err) })
  }

  private getBuildPath (build: string) {
    let path = ''
    if (this.type === 'hosts') {
      path = this.type
    } else {
      path = 'clients/' + build
    }
    return path
  }

}
