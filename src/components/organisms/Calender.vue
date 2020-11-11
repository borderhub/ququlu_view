<!-- カレンダー -->
<template>
  <v-row fluid full-height align-content="center" justify="center" class="pa-0 ma-0">
    <v-col>
      <v-subheader>Calender | カレンダー</v-subheader>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                color="grey darken-2"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>{{typeToLabel['month']}}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>{{typeToLabel['week']}}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>{{typeToLabel['day']}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          locale="ja-jp"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<!-- カレンダー -->

<script lang="ts">
  import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
  import {CalenderEventInterface,
    CalenderTermObjectInterface,
    CalenderTermInterface,
    CalenderNativeEventInterface,
    CalenderFormatInterface,
    CalenderInstanceInterface} from '@/model/interfaces/calender-interface';
  import {HTMLElementEvent} from '@/model/interfaces/extends-interface';
  import _ from 'lodash';

  @Component({
    components: {
    }
  })
  export default class Calender extends Vue {
    /** Data **/
    private focus = '';
    private today = new Date().toISOString().substr(0, 10);
    private type = 'month';
    private typeToLabel = {
        'month': '月',
        'week': '週',
        'day': '日'
      };
    private weekday = [0, 1, 2, 3, 4, 5, 6];
    private weekdays = [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] }
    ];
    private start: CalenderTermObjectInterface | null = null;
    private end: CalenderTermObjectInterface | null = null;
    private selectedEvent = {};
    private selectedElement: HTMLElement | null = null;
    private selectedOpen = false;
    private events: CalenderEventInterface[] = [];
    private colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];
    private names = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'];

    /** Refs **/
    public $refs!: {
      'calendar': HTMLElement;
    };

    /** Computed **/
    get title() {
      const { start, end }: CalenderTermInterface = this as unknown as CalenderTermInterface;
      if ((!start || start === null) || (!end || end === null)) {
        return false;
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;
      const startYear = start.year ?? '2020';
      const endYear = end.year ?? '2020';
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + /*this.nth(start.day)*/ '日';
      const endDay = end.day + /*this.nth(end.day)*/ '日';
      switch (this.type) {
        case 'month':
          return `${startYear} ${startMonth}`;
        case 'week':
        case '4day':
          return `${startYear} ${startMonth} ${startDay} - ${suffixYear} ${suffixMonth} ${endDay}`;
        case 'day':
          return `${startYear} ${startMonth} ${startDay}`;
      }
      return '';
    }

    private get calendarInstance(): Vue & CalenderInstanceInterface {
      return this.$refs.calendar as unknown as Vue & CalenderInstanceInterface;
    }

    private get monthFormatter() {
      return this.calendarInstance.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    }

    /** Watch **/
    /** Methods **/
    private viewDay({ date }: {date: string}) {
      this.focus = date;
      this.type = 'day';
    }
    private getEventColor(event: CalenderEventInterface) {
      return event.color;
    }
    private setToday() {
      this.focus = this.today;
    }
    private prev() {
      this.calendarInstance.prev();
    }
    private next() {
      this.calendarInstance.next();
    }
    private showEvent({ nativeEvent, event }: {
      nativeEvent: HTMLElementEvent<HTMLElement>;
      event: CalenderEventInterface;
    }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => this.selectedOpen = true, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    }

    private updateRange({ start, end }: CalenderTermInterface) {
      const events: CalenderEventInterface[] = [];

      const min = new Date(`${start?.date}T00:00:00`);
      const max = new Date(`${end?.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: this.formatDate(first, !allDay),
          end: this.formatDate(second, !allDay),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          details: 'test'
        });
      }
      if (start) { this.start = start; }
      if (end) { this.end = end; }
      this.events = events;
    }

    private nth(d: number) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    }

    private rnd(a: number, b: number) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    }

    private formatDate(a: Date, withTime: boolean) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }

    // エラーの伝搬
    @Emit('error')
    private errorPropagation(err: Error): Error {
      console.log(err);
      return err;
    }

    /** LifeCycle **/
    private async mounted() {
      this.$nextTick(() => {
        this.calendarInstance.checkChange();
      });
    }

  }
</script>

<style lang="scss" scoped>
</style>
