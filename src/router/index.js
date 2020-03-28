import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { getNumber, getAge, getGender, getResidence, getSchooling, 
         getWorkStatus, getEconomicalStatus, getMaritalStatus, 
         getHousehold, getReligion, getTraitQuestions, 
         getTraitAnswers, getTraitName, getCorrectTrait } from '../utils/user-info.js';

import { highlightSubject, dehighlightSubject, dehighlightAllSubjects,
         showUserInfo, hideUserInfo } from '../utils/highlighting.js';

import * as d3 from 'd3v4';

Vue.prototype.$getNumber = getNumber;
Vue.prototype.$getAge = getAge;
Vue.prototype.$getGender = getGender;
Vue.prototype.$getResidence = getResidence;
Vue.prototype.$getSchooling = getSchooling;
Vue.prototype.$getWorkStatus = getWorkStatus;
Vue.prototype.$getEconomicalStatus = getEconomicalStatus;
Vue.prototype.$getMaritalStatus = getMaritalStatus;
Vue.prototype.$getHousehold = getHousehold;
Vue.prototype.$getReligion = getReligion;
Vue.prototype.$getTraitQuestions = getTraitQuestions;
Vue.prototype.$getTraitAnswers = getTraitAnswers;
Vue.prototype.$getTraitName = getTraitName;
Vue.prototype.$getCorrectTrait = getCorrectTrait;

Vue.prototype.$highlightSubject = highlightSubject;
Vue.prototype.$dehighlightSubject = dehighlightSubject;
Vue.prototype.$dehighlightAllSubjects = dehighlightAllSubjects;
Vue.prototype.$showUserInfo = showUserInfo;
Vue.prototype.$hideUserInfo = hideUserInfo;

Vue.prototype.els = [];
Vue.prototype.filters = {
  gender: [],
  age: [],
  traits: {
      neuroticism: [],
      extraversion: [],
      openness: [],
      agreeableness: [],
      conscientiousness: []
  },
  toApplyGenderAndAge: Vue.prototype.els,
  toApply: Vue.prototype.els
};

Vue.prototype.scatterExists = false;
Vue.prototype.scatterData =  null;

Vue.prototype.boxplotExists = false;
Vue.prototype.bp_y = null;
Vue.prototype.bp_center = null;
Vue.prototype.bp_width = null;
Vue.prototype.bp_data = (d) => [
    d.Neuroticismo_NEOFFI,
    d.Extroversão_NEOFFI,
    d.AberturaExperiência_NEOFFI,
    d.AmabIilidade_NEOFFI,
    d.Conscienciosidade_NEOFFI
];

Vue.prototype.histogramExists = false;
Vue.prototype.histogramData = null;

Vue.prototype.currentAge1 = 0;
Vue.prototype.currentAge2 = 100;

Vue.prototype.currentNeuroticism1 = 0;
Vue.prototype.currentNeuroticism2 = 48;

Vue.prototype.currentExtraversion1 = 0;
Vue.prototype.currentExtraversion2 = 48;

Vue.prototype.currentOpenness1 = 0;
Vue.prototype.currentOpenness2 = 48;

Vue.prototype.currentAgreeableness1 = 0;
Vue.prototype.currentAgreeableness2 = 48;

Vue.prototype.currentConscientiousness1 = 0;
Vue.prototype.currentConscientiousness2 = 48;

Vue.prototype.$d3 = d3;

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
