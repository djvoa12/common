import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default Service.extend({
  iliosConfig: service(),

  version: computed(function () {
    const { apiVersion } = getOwner(this).resolveRegistration('config:environment');

    return apiVersion;
  }),

  isMismatched: computed('iliosConfig.apiVersion', 'version', async function () {
    const serverApiVersion = await this.iliosConfig.apiVersion;
    return serverApiVersion !== this.version;
  }),
});