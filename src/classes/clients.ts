import { Selector } from '../lib/selector'

import { Builds } from '../classes/builds'
import { Docker } from '../classes/docker'

export class Clients extends Builds {

  current: String = ''
  availableClients: Array<string> = []

  constructor (docker: Docker) {
    super(docker, 'clients')
  }

  public async set () {
    await this.init()
    if (this.current === '') {
      let client = Selector.builder('Pick a client',super.getAvailableChoices(this.availableClients))
      let name = Selector.inline('What domain name should it use? (ex: domain.com)')
      let createDev = Selector.YNQuestion('Should we build a dev subdomain?')
      let repoExists = Selector.YNQuestion('Is there a repo URL?')

      if (repoExists) {
        let repo = Selector.inline('What is the repo url? (ex: bitbucket.org:solutionnine/domain_com.git)').toLowerCase()
        await super.prepareBuild(client, name, repo)
      } else {
        await super.prepareBuild(client, name)
      }

      await super.defineEnvironment(name)
      await super.performBuild(client, name)

      if (createDev) {
        await super.prepareBuild(client, 'dev_' + name)
        await super.defineEnvironment('dev_' + name)
        await super.performBuild(client, 'dev_' + name)
      }
    }
  }

  public async get () {
    await this.init()
    return this.current
  }

  /**
   * Returns an array of all the available hosts
   */
  public async getAvailableClients () {
    await this.init()
    return this.availableClients
  }

  public async printAvailableClients () {
    await this.init()
    console.log('\n', this.availableClients)
  }

  private async init () {
    if (this.availableClients.length === 0) {
      this.availableClients = await super.fetchAvailableBuilds()
    }
    if (this.current === '') {
      // Read a json file
      // this.current = await super.fetchCurrentBuild()
    }
  }
}
