import Vue from 'vue';
import Component, { mixins, createDecorator } from 'vue-class-component';

export { Vue, Component, mixins, createDecorator };
export * from 'vue-property-decorator';
export * from 'vuex-class';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave',
  'asyncData',
  'head',
]);
