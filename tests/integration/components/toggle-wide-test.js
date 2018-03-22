import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | toggle wide', function(hooks) {
  setupRenderingTest(hooks);

  skip('it renders', function(assert) {
    this.render(hbs`{{toggle-wide}}`);
    assert.equal(this.$().text().trim(), '');
  });
});
