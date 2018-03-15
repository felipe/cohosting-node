import * as fs from 'fs-extra'
import * as compose from 'docker-compose'
import * as git from 'simple-git/promise'

import { Selector } from '../lib/selector'

import { Choice } from '../objects/choice'

import { Docker } from '../classes/docker'

export class Builds {
  type: string = ''
  docker: Docker = new Docker()

  constructor (docker: Docker, type: string) {
    this.type = type
    this.docker = docker
  }

  public getAvailableChoices (items: Array<string>) {
    let choices: Array<Choice> = []
    items.forEach(item => {
      choices.push(new Choice(item, item))
    })
    return choices
  }

  public async fetchAvailableBuilds () {
    return new Promise<Array<string>>(resolve => {
      let builds: Array<string> = []
      return fs.readdir(__dirname + '/../docker/' + this.type + '/')
        .catch(() => {
          return fs.readdir(__dirname + '/../static/docker/' + this.type + '/')
        })
        .catch(() => {
          return []
        })
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

  public async fetchCurrentBuilds () {
    return fs.readJson(__dirname + '/../../../chconfig.json')
      .then(data => { return data })
      .catch(() => { return {} })
  }

  public async prepareBuild (build: string, name?: string, repo?: string) {

    let cleanName = ''
    let tld = ''
    if (name) {
      cleanName = name.replace('.','').replace(' ','').toLowerCase()
      tld = name.replace('.com','').replace('.net','').replace('.org','').replace('.co','').replace('.me','')
    }

    return new Promise(resolve => {
      return fs.mkdirs('./docker/' + this.getBuildPath(name ? cleanName : build) + '/')
        .then(() => {
          return fs.copy('./build/main/docker/' + this.type + '/' + build, './docker/' + this.getBuildPath(name ? cleanName : build) + '/')
        })
        .then(() => {
          if (name && repo) {
            git().clone(repo, './docker/clients/' + cleanName + '/data/' + tld)
          }
        })
        .then(() => { resolve() })
        .catch(err => { console.error(err) })
    })
    .catch(err => { console.error(err) })
  }

  public async defineEnvironment (name: string) {

    let cleanName = ''
    let tld = ''
    if (name) {
      cleanName = name.replace('.','').replace(' ','').toLowerCase()
      tld = name.replace('.com','').replace('.net','').replace('.org','').replace('.co','').replace('.me','')
    }

    return fs.readJson('./docker/clients/' + cleanName + '/env.json')
      .then(data => {
        data['fields'].forEach(field => {
          let response = Selector.inline('Set value for `' + field + '`')
          fs.appendFileSync('./docker/clients/' + cleanName + '/.env', field + '=' + response + '\n')
        })
      })
      .catch(() => { /* File does not have to exist. Doing nothing here.*/ })
  }

  public async performBuild (build: string, name?: string) {

    let cleanName = ''
    let tld = ''
    if (name) {
      cleanName = name.replace('.','').replace(' ','').toLowerCase()
      tld = name.replace('.com','').replace('.net','').replace('.org','').replace('.co','').replace('.me','')
    }

    compose.up({ cwd: './docker/' + this.getBuildPath(name ? cleanName : build) + '/' })
      .then(async () => { return new Promise(waited => { setTimeout(() => { waited(true) }, 15000) }) })
      .then(async () => {
        if (name) {
          console.log('\n' + build + ' `' + cleanName + '` has been built.')
        } else {
          let builds = await this.fetchCurrentBuilds()
          builds[this.type] = build
          await this.saveBuilds(builds)
          console.log('\n' + this.type + ' `' + build + '` has been built.')
        }
      })
      .catch(err => { console.error(err) })

  }

  /* test-code */
  _testGetBuildPath = (build: string) => { return this.getBuildPath(build) }
  /* end-test-code */

  /* test-code */
  _testSaveBuilds = (builds: object) => { return this.saveBuilds(builds) }
  /* end-test-code */

  private getBuildPath (build: string) {
    let path = ''
    if (this.type === 'hosts') {
      path = this.type
    } else {
      path = 'clients/' + build
    }
    return path
  }

  private async saveBuilds (builds: object) {
    fs.outputJsonSync(__dirname + '/../../../chconfig.json', builds)
  }

}
