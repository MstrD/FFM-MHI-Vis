<template>
  <div class="row">
    <Parallel />
    <Scatter />
    <Heatmap />
    <Boxplot />
    <Histogram />
    <Sankey />
  </div>
</template>

<script>
import * as d3 from 'd3v4';
import Parallel from 'components/Parallel';
import Scatter from 'components/Scatter';
import Heatmap from 'components/Heatmap';
import Boxplot from 'components/Boxplot';
import Histogram from 'components/Histogram';
import Sankey from 'components/Sankey';

export default {
  name: 'PageIndex',
  components: {
    Parallel,
    Scatter,
    Heatmap,
    Boxplot,
    Histogram,
    Sankey
  },
  methods: {
    initialLoad() { 
      var self = this; // needed because scope changes
      d3.json('statics/db_fpul.json', function(err, data) {
        if (err) throw err;
        
        data.forEach(element => {
            self.$els.push(element);
        });

        /* var traits = {
            neuroticism: 0,
            extraversion: 0,
            openness: 0,
            agreeableness: 0,
            conscientiousness: 0,
            mhi: 0
        };
        self.$els.forEach(el => {
            traits.neuroticism += el.Neuroticismo_NEOFFI;
            traits.extraversion += el.Extroversão_NEOFFI;
            traits.openness += el.AberturaExperiência_NEOFFI;
            traits.agreeableness += el.AmabIilidade_NEOFFI;
            traits.conscientiousness += el.Conscienciosidade_NEOFFI;
            traits.mhi += el.MH5_total;
        }); */

        self.$root.$emit('drawParallel', self.$els);
        self.$root.$emit('drawScatter', self.$els);
        self.$root.$emit('drawBoxplot', self.$els);
        self.$root.$emit('drawHistogram', self.$els, 0);
      });

      d3.json('statics/db_sankey.json', function(err, data) {
        if (err) throw err;
        
        self.$elsSankey = data;
        self.$root.$emit('drawSankey', self.$elsSankey);
      });
    }
  },
  created() {
    this.initialLoad();
  }
}
</script>

<style lang="scss">
  #user_info {
    opacity: 1;
  }
</style>
