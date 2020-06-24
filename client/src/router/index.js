import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { getNumber, getAge, getGender, getResidence, getSchooling, 
         getWorkStatus, getEconomicalStatus, getMaritalStatus, 
         getHousehold, getReligion, getTraitQuestions, 
         getTraitAnswers, getTraitName, getCorrectTrait, getQuestionsVerbose, getUserById } from '../utils/user-info.js';

import { highlightSubject, dehighlightSubject, dehighlightAllSubjects } from '../utils/highlighting.js';

import * as d3 from 'd3v4';
import VueDraggable from 'vue-draggable';
import { colors } from 'quasar';
import { axiosInstance } from 'boot/axios';

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
Vue.prototype.$getUserById = getUserById;
Vue.prototype.$getQuestionsVerbose = getQuestionsVerbose;

Vue.prototype.$highlightSubject = highlightSubject;
Vue.prototype.$dehighlightSubject = dehighlightSubject;
Vue.prototype.$dehighlightAllSubjects = dehighlightAllSubjects;

Vue.prototype.$getColor = colors.getBrand;
Vue.prototype.$setColor = colors.setBrand;

Vue.prototype.$isHighlighted = { value: false };

Vue.prototype.$els = [];
Vue.prototype.$filters = {
  gender: [],
  age: [],
  traits: {
      neuroticism: [],
      extraversion: [],
      openness: [],
      agreeableness: [],
      conscientiousness: []
  },
  toApplyGenderAndAge: Vue.prototype.$els,
  toApply: Vue.prototype.$els
};

Vue.prototype.$elsSankey = {};

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

Vue.prototype.$scatterUsers = [];
Vue.prototype.$violinUsers = [];

Vue.prototype.$d3 = d3;

axiosInstance.get('/maleColor')
    .then((res) => {
      colors.setBrand('male', res.data);
    })
    .catch((err) => {
      console.log(err);
    });
;

axiosInstance.get('/femaleColor')
    .then((res) => {
      colors.setBrand('female', res.data);
    })
    .catch((err) => {
      console.log(err);
    });
;

Vue.use(VueRouter)
Vue.use(VueDraggable)

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
