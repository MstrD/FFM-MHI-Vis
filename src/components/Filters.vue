<template>
  <div class="q-pa-md q-gutter-md">
    <q-list padding class="rounded-borders" style="max-width: 500px">
      <q-item-label header>Individual Filters</q-item-label>

      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="person" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">by ID</q-item-label>
          <q-item-label caption>Filter a single individual</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-checkbox v-model="info_id" v-if="info_gender || info_age || info_traits" disable />
          <q-checkbox v-model="info_id" v-else @input="drawOriginals(info_id)" color="positive" />
        </q-item-section>
      </q-item>

      <q-field
        filled
        clearable
        v-if="info_id"
        :hint="`Choose a subject between #0 and #199`"
        :value="slider"
        @input="val => (val === null)"
        @clear="val => {slider = 0; filterDataById(slider)}"
      >
        <template v-slot:control>
          <q-slider
            :value="slider"
            @change="val => { slider = val; filterDataById(val); }"
            :min="0"
            :max="199"
            label
            label-always
            class="q-mt-md"
          />
        </template>
      </q-field>

      <q-separator spaced />
      <q-item-label header>General Filters</q-item-label>

      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="wc" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">by Gender</q-item-label>
          <q-item-label caption>Male or Female</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-checkbox v-if="info_id" disable v-model="info_gender" />
          <q-checkbox v-else v-model="info_gender" color="positive" @input="drawOriginals(info_gender)" />
        </q-item-section>
      </q-item>

      <q-option-group
        v-if="info_gender"
        v-model="gender_group"
        :options="options"
        @input="filterDataByGender(gender_group)"
        color="primary"
        inline
    />

      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="show_chart" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">by Age</q-item-label>
          <q-item-label caption>Select age range</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-checkbox v-if="info_id" disable v-model="info_age" />
          <q-checkbox v-else v-model="info_age" color="positive" @input="drawOriginals(info_age)" />
        </q-item-section>
      </q-item>

      <q-field
        filled
        :hint="`Range between 18 and 78`"
        :value="range"
        v-if="info_age"
        @input="val => (val === null && (range = { min: 18, max: 78 }))"
        @clear="() => {filterDataByAge(range.min, range.max, true)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range"
            @change="val => { range = val; filterDataByAge(range.min, range.max, true) }"
            label
            label-always
            :min="18"
            :max="78"
          />
        </template>
      </q-field>

      <q-item v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="tune" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">by Traits</q-item-label>
          <q-item-label caption>FFM and MHI</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-checkbox v-if="info_id" disable v-model="info_traits" />
          <q-checkbox v-else v-model="info_traits" color="positive" @input="drawOriginals(info_traits)"/>
        </q-item-section>
      </q-item>
      <!-- NEUROTICISM -->
      <q-field
        filled
        :hint="`Neuroticism value`"
        :value="range_n"
        v-if="info_traits"
        @input="val => (val === null && (range_n = { min: 0, max: 48 }))"
        @clear="() => {filterDataByTraits(0, range_n.min, range_n.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_n"
            @change="val => { range_n = val; filterDataByTraits(0, range_n.min, range_n.max) }"
            label
            label-always
            :min="range_ffm.min"
            :max="range_ffm.max"
          />
        </template>
      </q-field>
      <!-- EXTRAVERSION -->
      <q-field class="q-pt-md"
        filled
        :hint="`Extraversion value`"
        :value="range_e"
        v-if="info_traits"
        @input="val => (val === null && (range_e = { min: 0, max: 48 }))"
        @clear="() => {filterDataByTraits(1, range_e.min, range_e.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_e"
            @change="val => { range_e = val; filterDataByTraits(1, range_e.min, range_e.max) }"
            label
            label-always
            :min="range_ffm.min"
            :max="range_ffm.max"
          />
        </template>
      </q-field>
      <!-- OPENNESS -->
      <q-field class="q-pt-md"
        filled
        :hint="`Openness value`"
        :value="range_o"
        v-if="info_traits"
        @input="val => (val === null && (range_o = { min: 0, max: 48 }))"
        @clear="() => {filterDataByTraits(2, range_o.min, range_o.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_o"
            @change="val => { range_o = val; filterDataByTraits(2, range_o.min, range_o.max) }"
            label
            label-always
            :min="range_ffm.min"
            :max="range_ffm.max"
          />
        </template>
      </q-field>
      <!-- AGREEABLENESS -->
      <q-field class="q-pt-md"
        filled
        :hint="`Agreeableness value`"
        :value="range_a"
        v-if="info_traits"
        @input="val => (val === null && (range_a = { min: 0, max: 48 }))"
        @clear="() => {filterDataByTraits(3, range_a.min, range_a.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_a"
            @change="val => { range_a = val; filterDataByTraits(3, range_a.min, range_a.max) }"
            label
            label-always
            :min="range_ffm.min"
            :max="range_ffm.max"
          />
        </template>
      </q-field>
      <!-- CONSCIENTIOUSNESS -->
      <q-field class="q-pt-md"
        filled
        :hint="`Conscientiousness value`"
        :value="range_c"
        v-if="info_traits"
        @input="val => (val === null && (range_c = { min: 0, max: 48 }))"
        @clear="() => {filterDataByTraits(4, range_c.min, range_c.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_c"
            @change="val => { range_c = val; filterDataByTraits(4, range_c.min, range_c.max) }"
            label
            label-always
            :min="range_ffm.min"
            :max="range_ffm.max"
          />
        </template>
      </q-field>
      <!-- MHI -->
      <q-field class="q-pt-md"
        filled
        :hint="`MHI value`"
        :value="range_mhi"
        v-if="info_traits"
        @input="val => (val === null && (range_mhi = { min: 0, max: 30 }))"
        @clear="() => {filterDataByTraits(5, range_mhi.min, range_mhi.max)}"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range_mhi"
            @change="val => { range_mhi = val; filterDataByTraits(4, range_mhi.min, range_mhi.max) }"
            label
            label-always
            :min="0"
            :max="30"
          />
        </template>
      </q-field>

      <q-btn
        outline
        class="q-mr-lg q-mt-sm q-mb-md"
        color="negative"
        icon-right="restore"
        label="Restore Selection"
        style="float: right"
        @click="restoreSelection()"
      />
    </q-list>
  </div>
</template>

<script>
export default {
    name: 'Filters',
    data () {
        return {
            slider: 0,

            info_id: false,

            info_gender: false,
            gender_group: '',
            options: [
                {
                    label: 'Male',
                    value: 'male'
                },
                {
                    label: 'Female',
                    value: 'female'
                }
            ],

            info_age: false,
            range: {
                min: 18,
                max: 78
            },

            info_traits: false,
            range_ffm: {
                min: 0,
                max: 48
            },
            range_n: {
                min: 0,
                max: 48
            },
            range_e: {
                min: 0,
                max: 48
            },
            range_o: {
                min: 0,
                max: 48
            },
            range_a: {
                min: 0,
                max: 48
            },
            range_c: {
                min: 0,
                max: 48
            },
            range_mhi: {
                min: 0,
                max: 30
            }
        }
    },
    methods: {
        filterDataById(id) {
            this.$filters.toApply = this.$els.filter((d) => d.Nº === id);
            this.renewCharts(this.filterDataById.name);
        },
        filterDataByGender(gender) {
            if (this.$filters.gender.length)
                this.$filters.gender = [];
            switch (gender) {
                case 'male':
                    this.$filters.gender = this.$els.filter((d) => d.Q1_Sexo === 1);
                    break;
                case 'female':
                    this.$filters.gender = this.$els.filter((d) => d.Q1_Sexo === 2);
                    break;
            }
            this.$filters.toApplyGenderAndAge = this.$filters.gender;
            this.$filters.toApply = this.$filters.gender;
            this.renewCharts(this.filterDataByGender.name);
        },
        filterDataByAge(age1, age2, toRenew) {
            var myFilter = this.$filters.gender.length ? this.$filters.gender : this.$els;
            if (age1 < age2) {
                this.currentAge1 = age1;
                this.currentAge2 = age2;
                this.$filters.age = myFilter.filter((d) => d.Q2_Idade >= age1 && d.Q2_Idade <= age2);
                this.$filters.toApplyGenderAndAge = this.$filters.age;
                this.$filters.toApply = this.$filters.age;
                if (toRenew)
                    this.renewCharts(this.filterDataByAge.name);
            }
        },
        filterDataByTraits(trait, value1, value2) { // FIXME: a different array for each trait, perhaps?
            var myFilter = this.$filters.toApplyGenderAndAge === this.$filters.toApply ? this.$filters.toApplyGenderAndAge : this.$filters.toApply;
            switch (trait) {
                case 0:
                    this.$filters.traits.neuroticism = myFilter.filter((d) => d.Neuroticismo_NEOFFI >= value1 && d.Neuroticismo_NEOFFI <= value2);
                    this.currentNeuroticism1 = value1;
                    this.currentNeuroticism2 = value2;
                    this.$filters.toApply = this.$filters.traits.neuroticism;
                    break;
                case 1:
                    this.$filters.traits.extraversion = myFilter.filter((d) => d.Extroversão_NEOFFI >= value1 && d.Extroversão_NEOFFI <= value2);
                    this.currentExtraversion1 = value1;
                    this.currentExtraversion2 = value2;
                    this.$filters.toApply = this.$filters.traits.extraversion;
                    break;
                case 2:
                    this.$filters.traits.openness = myFilter.filter((d) => d.AberturaExperiência_NEOFFI >= value1 && d.AberturaExperiência_NEOFFI <= value2);
                    this.currentOpenness1 = value1;
                    this.currentOpenness2 = value2;
                    this.$filters.toApply = this.$filters.traits.openness;
                    break;
                case 3:
                    this.$filters.traits.agreeableness = myFilter.filter((d) => d.AmabIilidade_NEOFFI >= value1 && d.AmabIilidade_NEOFFI <= value2);
                    this.currentAgreeableness1 = value1;
                    this.currentAgreeableness2 = value2;
                    this.$filters.toApply = this.$filters.traits.agreeableness;
                    break;
                case 4:
                    this.$filters.traits.conscientiousness = myFilter.filter((d) => d.Conscienciosidade_NEOFFI >= value1 && d.Conscienciosidade_NEOFFI <= value2);
                    this.currentConscientiousness1 = value1;
                    this.currentConscientiousness2 = value2;
                    this.$filters.toApply = this.$filters.traits.conscientiousness;
                    break;
            }
            this.renewCharts(this.filterDataByTraits.name);
        },
        renewCharts(funcName) {
            if (funcName === this.filterDataByGender.name) {
                this.filterDataByAge(this.currentAge1, this.currentAge2, false);
                this.filterAllTraits();
            }
            if (funcName === this.filterDataByAge.name) {
                this.filterAllTraits();
            }
            if (funcName !== this.filterDataById.name) {
                this.$root.$emit('drawBoxplot', this.$filters.toApply);
                this.$root.$emit('drawViolin', this.$filters.toApply);
            }
            this.$root.$emit('drawParallel', this.$filters.toApply);
            this.$root.$emit('drawScatter', this.$filters.toApply);
            this.$root.$emit('drawHistogram', this.$filters.toApply);
            this.$root.$emit('updateFilter', this.$filters.toApply);
        },
        filterAllTraits() {
            this.filterDataByTraits(0, this.currentNeuroticism1, this.currentNeuroticism2);
            this.filterDataByTraits(1, this.currentExtraversion1, this.currentExtraversion2);
            this.filterDataByTraits(2, this.currentOpenness1, this.currentOpenness2);
            this.filterDataByTraits(3, this.currentAgreeableness1, this.currentAgreeableness2);
            this.filterDataByTraits(4, this.currentConscientiousness1, this.currentConscientiousness2);
        },
        drawOriginals(isChecked) {
            if (!isChecked) { // reset values
                this.slider = 0;
                this.gender_group = '';
                this.range = {
                    min: 18,
                    max: 78
                };
                this.range_n = this.range_e = this.range_o = this.range_a = this.range_c = {
                    min: 0,
                    max: 48
                };
                this.range_mhi = {
                    min: 0,
                    max: 30
                };
                this.currentNeuroticism1 = this.currentExtraversion1 = 
                this.currentOpenness1 = this.currentAgreeableness1 =
                this.currentConscientiousness1 = 0;
                this.currentNeuroticism2 = this.currentExtraversion2 = 
                this.currentOpenness2 = this.currentAgreeableness2 =
                this.currentConscientiousness2 = 48;
                this.$filters.toApply = this.$els;

                this.$root.$emit('drawParallel', this.$els);
                this.$root.$emit('drawScatter', this.$els);
                this.$root.$emit('drawViolin', this.$els);
                this.$root.$emit('drawBoxplot', this.$els);
                this.$root.$emit('drawHistogram', this.$els);
                this.$root.$emit('updateFilter', this.$els);
            }
        },
        restoreSelection() {
          this.drawOriginals(false);
          // the lines below clear the checkboxes
          this.info_id = false;
          this.info_gender = false;
          this.info_age = false;
          this.info_traits = false;
        }
    }
}
</script>