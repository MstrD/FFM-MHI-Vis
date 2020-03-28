<template>
  <q-page class="column column-center">
    <Parallel ref="parallel"/>
    <div id="user_info" class="chart-container">
        <h6>User Profile</h6>
    </div>
    <Scatter ref="scatter" />
    <Heatmap ref="heatmap" />
    <Boxplot ref="boxplot" />
    <Histogram ref="histogram" />
  </q-page>
</template>

<script>
import * as d3 from 'd3v4';
import Parallel from 'components/Parallel';
import Scatter from 'components/Scatter';
import Heatmap from 'components/Heatmap';
import Boxplot from 'components/Boxplot';
import Histogram from 'components/Histogram';

export default {
  name: 'PageIndex',
  components: {
    Parallel,
    Scatter,
    Heatmap,
    Boxplot,
    Histogram
  },
  methods: {
    initialLoad() { 
      var self = this; // needed because scope changes
      d3.json('statics/db_fpul.json', function(err, data) {
        if (err) throw err;
        
        data.forEach(element => {
            self.els.push(element);
        });

        /* var traits = {
            neuroticism: 0,
            extraversion: 0,
            openness: 0,
            agreeableness: 0,
            conscientiousness: 0,
            mhi: 0
        };
        self.els.forEach(el => {
            traits.neuroticism += el.Neuroticismo_NEOFFI;
            traits.extraversion += el.Extroversão_NEOFFI;
            traits.openness += el.AberturaExperiência_NEOFFI;
            traits.agreeableness += el.AmabIilidade_NEOFFI;
            traits.conscientiousness += el.Conscienciosidade_NEOFFI;
            traits.mhi += el.MH5_total;
        }); */

        self.$root.$emit('drawParallel', self.els);
        self.$root.$emit('drawScatter', self.els);
        self.$root.$emit('drawBoxplot', self.els);
        self.$root.$emit('drawHistogram', self.els, 0);
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
