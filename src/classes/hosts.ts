import { Selector } from '../lib/selector'

import { Builds } from '../classes/builds'
import { Docker } from '../classes/docker'

export class Hosts extends Builds {

  current: String = ''
  availableHosts: Array<string> = []

  constructor (docker: Docker) {
    super(docker, 'hosts')
  }

  public async set () {
    await this.init()
    if (this.current === '') {
      let host = Selector.builder('Pick a base host',super.getAvailableChoices(this.availableHosts))
      await super.prepareBuild(host)
      await super.performBuild(host)
    }
  }

  public async get () {
    await this.init()
    return this.current
  }

  /**
   * Returns an array of all the available hosts
   */
  public async getAvailableHosts () {
    await this.init()
    return this.availableHosts
  }

  public async printAvailableHosts () {
    await this.init()
    console.log('\n', this.availableHosts)
  }

  private async init () {
    if (this.availableHosts.length === 0) {
      this.availableHosts = await super.fetchAvailableBuilds()
    }
    if (this.current === '') {
      // Read a json file
      // this.current = await super.fetchCurrentBuild()
    }
  }
}
