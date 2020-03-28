<template>
  <q-list dense>
  <!-- TODO: apply infinite scroll ? -->
      <q-expansion-item
        group="somegroup"
        label="First"
        header-class="bg-grey-3 text-primary"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar square color="primary" text-color="white">
              {{ Nº }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            Subject #{{ Nº }}
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <strong>Age:</strong> {{ Q2_Idade }} <br>
            <strong>Gender:</strong> {{ this.$getGender(Q1_Sexo) }} <br>
            <strong>Residence:</strong> {{ this.$getResidence(Q4_Residência) }} <br>
            <strong>Schooling:</strong> {{ this.$getSchooling(Q5_Ensino) }} <br>
            <strong>Work Status:</strong> {{ this.$getWorkStatus(Q6_Profissão) }} <br>
            <strong>Economical Status:</strong> {{ this.$getEconomicalStatus(Q8_Situação_Económica) }} <br>
            <strong>Marital Status:</strong> {{ this.$getMaritalStatus(Q9_Estado_Civil) }} <br>
            <strong>Household:</strong> {{ this.$getHousehold(Q10_Agregado_Familiar) }} <br>
            <strong>Religion:</strong> {{ this.$getReligion(Q13_Religião, Descrição_Outra_Religião) }} <br>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-separator />
  </q-list>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    Nº: {
      type: Number
    },
    Q2_Idade: {
      type: Number
    },
    Q1_Sexo: {
      type: Number
    },
    Q4_Residência: {
      type: [Number, String]
    },
    Q5_Ensino: {
      type: [Number, String]
    },
    Q6_Profissão: {
      type: [Number, String]
    },
    Q10_Agregado_Familiar: {
      type: [Number, String]
    },
    Q8_Situação_Económica: {
      type: [Number, String]
    },
    Q9_Estado_Civil: {
      type: [Number, String]
    },
    Q13_Religião: {
      type: [Number, String]
    },
    Descrição_Outra_Religião: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .q-avatar {
    stroke: white;
  }
</style>