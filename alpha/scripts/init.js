var els = [];
var filters = {
    gender: [],
    age: [],
    traits: {
        neuroticism: [],
        extraversion: [],
        openness: [],
        agreeableness: [],
        conscientiousness: []
    },
    toApplyGenderAndAge: els,
    toApply: els
};

var currentAge1 = 0;
var currentAge2 = 100;

var currentNeuroticism1 = 0;
var currentNeuroticism2 = 48;

var currentExtraversion1 = 0;
var currentExtraversion2 = 48;

var currentOpenness1 = 0;
var currentOpenness2 = 48;

var currentAgreeableness1 = 0;
var currentAgreeableness2 = 48;

var currentConscientiousness1 = 0;
var currentConscientiousness2 = 48;

var scatterExists = false;
var scatterData = null;
var scatterIndex = 'MHI';

var boxplotExists = false;
var bp_y, bp_center, bp_width;
var bp_data = (d) => [
    d.Neuroticismo_NEOFFI,
    d.Extroversão_NEOFFI,
    d.AberturaExperiência_NEOFFI,
    d.AmabIilidade_NEOFFI,
    d.Conscienciosidade_NEOFFI
];

var histogramExists = false;
var histogramData = null;
var histogramIndex = 0;

d3.json('data/db_fpul.json', function(err, data) {
  if (err) throw err;

  data.forEach(element => {
      els.push(element);
  });

  var traits = {
      neuroticism: 0,
      extraversion: 0,
      openness: 0,
      agreeableness: 0,
      conscientiousness: 0,
      mhi: 0
  };
  els.forEach(el => {
      traits.neuroticism += el.Neuroticismo_NEOFFI;
      traits.extraversion += el.Extroversão_NEOFFI;
      traits.openness += el.AberturaExperiência_NEOFFI;
      traits.agreeableness += el.AmabIilidade_NEOFFI;
      traits.conscientiousness += el.Conscienciosidade_NEOFFI;
      traits.mhi += el.MH5_total;
  });
  
  // REAL DATA
  var data_radar = [
      {
          className: 'average',
          axes: [
              {axis: 'Neuroticism', value: traits.neuroticism / els.length},
              {axis: 'Extraversion', value: traits.extraversion / els.length},
              {axis: 'Openness', value: traits.openness / els.length},
              {axis: 'Agreeableness', value: traits.agreeableness / els.length},
              {axis: 'Conscientiousness', value: traits.conscientiousness / els.length},
              {axis: 'MHI Index', value: traits.mhi / els.length}
          ]
      }
  ];
  drawParallel(els);
  drawScatter(els, 'MHI');
  drawBoxplot(els);
  drawHistogram(els, 0);
});