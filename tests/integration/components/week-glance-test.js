import Service from '@ember/service';
import moment from 'moment';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { component } from 'ilios-common/page-objects/components/week-glance';

module('Integration | Component | week glance', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  const today = moment('2019-01-15');

  hooks.beforeEach(function () {
    this.server.create('userevent', {
      name: 'Learn to Learn',
      startDate: today.format(),
      isBlanked: false,
      isPublished: true,
      isScheduled: false,
      offering: 1,
    });
    this.server.create('userevent', {
      name: 'Finding the Point in Life',
      startDate: today.format(),
      isBlanked: false,
      isPublished: true,
      isScheduled: false,
      ilmSession: 1,
    });
    this.server.create('userevent', {
      name: 'Blank',
      isBlanked: true,
    });
    this.server.create('userevent', {
      name: 'Not Published',
      isBlanked: false,
      isPublished: false,
      isScheduled: false,
    });
    this.server.create('userevent', {
      name: 'Scheduled',
      isBlanked: false,
      isPublished: true,
      isScheduled: true,
    });
    this.server.create('userevent', {
      name: 'Schedule some materials',
      startDate: today.format(),
      location: 'Room 123',
      isBlanked: false,
      isPublished: true,
      isScheduled: false,
      offering: 1,
    });
    const events = this.server.db.userevents;

    this.userEventsMock = Service.extend({
      async getEvents() {
        return events.toArray();
      },
    });
    this.blankEventsMock = Service.extend({
      async getEvents(){
        return [];
      }
    });

    this.getTitle = function(fullTitle){
      const startOfWeek = today.clone().day(0).hour(0).minute(0).second(0);
      const endOfWeek = today.clone().day(6).hour(23).minute(59).second(59);

      let expectedTitle;
      if (startOfWeek.month() != endOfWeek.month()) {
        const from = startOfWeek.format('MMMM D');
        const to = endOfWeek.format('MMMM D');
        expectedTitle = `${from} - ${to}`;
      } else {
        const from = startOfWeek.format('MMMM D');
        const to = endOfWeek.format('D');
        expectedTitle = `${from}-${to}`;
      }
      if (fullTitle) {
        expectedTitle += ' Week at a Glance';
      }

      return expectedTitle;
    };
  });

  test('it renders with events', async function(assert) {
    assert.expect(5);
    this.owner.register('service:user-events', this.userEventsMock);
    this.set('today', today);
    await render(hbs`{{week-glance
      collapsible=false
      collapsed=false
      showFullTitle=true
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
    }}`);

    assert.equal(component.title, this.getTitle(true));

    assert.equal(component.offeringEvents.length, 3);
    assert.equal(component.offeringEvents[0].title, 'Learn to Learn');
    assert.equal(component.offeringEvents[1].title, 'Finding the Point in Life');
    assert.equal(component.offeringEvents[2].title, 'Schedule some materials');
  });

  test('it renders blank', async function(assert) {
    assert.expect(2);
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');

    this.set('today', today);
    await render(hbs`{{week-glance
      collapsible=false
      collapsed=false
      showFullTitle=true
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
    }}`);
    const title = 'h3';
    const body = 'p';
    const expectedTitle = this.getTitle(true);

    await settled();

    assert.equal(this.element.querySelector(title).textContent.replace(/[\t\n\s]+/g, ""), expectedTitle.replace(/[\t\n\s]+/g, ""));
    assert.dom(this.element.querySelector(body)).hasText('None');

  });

  test('renders short title', async function(assert) {
    assert.expect(1);
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');

    this.set('today', today);
    await render(hbs`{{week-glance
      collapsible=false
      collapsed=false
      showFullTitle=false
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
    }}`);
    const title = 'h3';
    const expectedTitle = this.getTitle(false);
    await settled();

    assert.equal(this.element.querySelector(title).textContent.replace(/[\t\n\s]+/g, ""), expectedTitle.replace(/[\t\n\s]+/g, ""));
  });

  test('it renders collapsed', async function(assert) {
    assert.expect(2);
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');

    this.set('today', today);
    await render(hbs`{{week-glance
      collapsible=true
      collapsed=true
      showFullTitle=false
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
    }}`);
    const title = 'h3';
    const body = 'p';
    const expectedTitle = this.getTitle(false);

    await settled();

    assert.equal(this.element.querySelector(title).textContent.replace(/[\t\n\s]+/g, ""), expectedTitle.replace(/[\t\n\s]+/g, ""));
    assert.equal(this.element.querySelectorAll(body).length, 0);

  });

  test('click to expend', async function(assert) {
    assert.expect(1);
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');

    this.set('today', today);
    this.set('toggle', value => {
      assert.ok(value);
    });
    await render(hbs`{{week-glance
      collapsible=true
      collapsed=true
      showFullTitle=false
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
      toggleCollapsed=(action toggle)
    }}`);
    const title = 'h3';
    await settled();
    await click(title);
  });

  test('click to collapse', async function(assert) {
    assert.expect(1);
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');

    this.set('today', today);
    this.set('toggle', value => {
      assert.notOk(value);
    });
    await render(hbs`{{week-glance
      collapsible=true
      collapsed=false
      showFullTitle=false
      year=(moment-format today 'YYYY')
      week=(moment-format today 'W')
      toggleCollapsed=(action toggle)
    }}`);
    const title = 'h3';
    await settled();
    await click(title);
  });

  test('changing passed properties re-renders', async function(assert) {
    assert.expect(10);
    const nextYear = today.clone().add(1, 'year');
    let count = 1;
    this.blankEventsMock = Service.reopen({
      async getEvents(fromStamp, toStamp){
        const from = moment(fromStamp, 'X');
        const to = moment(toStamp, 'X');
        switch (count) {
        case 1:
          assert.ok(from.isSame(today, 'year'), 'From-date has same year as today.');
          assert.ok(to.isSame(today, 'year'), 'To-date has same year as today.');
          assert.ok(from.isSame(today, 'week'), 'From-date has same week as today.');
          assert.ok(to.isSame(today, 'week'), 'To-date has same wek as today.');
          break;
        case 2:
          assert.ok(from.isSame(nextYear, 'year'), 'From-date has same year as next year.');
          assert.ok(to.isSame(nextYear, 'year'), 'To-date has same year as next year.');
          // comparing weeks needs some wiggle room as dates may be shifting across week lines.
          assert.ok(1 >= Math.abs(from.week() - nextYear.week()), 'From-date is at the most one week off from next year.');
          assert.ok(1 >= Math.abs(to.week() - nextYear.week()), 'To-date has is at the most one week off from next year.');
          break;
        default:
          assert.notOk(true, 'Called too many times');
        }
        count++;
        return [];
      }
    });
    this.owner.register('service:user-events', this.blankEventsMock);
    this.userEvents = this.owner.lookup('service:user-events');


    let year = today.format('YYYY');
    this.set('year', year);
    this.set('today', today);
    await render(hbs`{{week-glance
      collapsible=false
      collapsed=false
      showFullTitle=true
      year=year
      week=(moment-format today 'W')
    }}`);
    const title = 'h3';
    const body = 'p';
    const expectedTitle = this.getTitle(true);

    await settled();

    assert.equal(this.element.querySelector(title).textContent.replace(/[\t\n\s]+/g, ""), expectedTitle.replace(/[\t\n\s]+/g, ""));
    assert.dom(this.element.querySelector(body)).hasText('None');

    this.set('year', nextYear.format('YYYY'));

    return settled();
  });
});
