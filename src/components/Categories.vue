<template>
  <div class="q-pa-md q-gutter-md" v-drag-and-drop:options="options">
    <q-list
      dense
      padding
      class="rounded-borders"
      style="max-width: 300px"
      @reordered="reordered($event, allNodes)"
    >
      <q-item-label header>Socioeconomical Factors</q-item-label>
      <q-item clickable v-ripple v-for="cat in allNodes" :key="cat">
        <q-item-section>
          {{ cat }}
        </q-item-section>
        <q-item-section side>
          <q-checkbox v-model="currentNodes.includes(cat)" @input="toggleOnSankey(cat)" color="primary" />
        </q-item-section>
      </q-item>

    </q-list>
  </div>
</template>

<script>
export default {
    name: 'Categories',
    props: {
      allNodes: Array,
      currentNodes: Array
    },
    data() {
      return {
        options: {
          multipleDropzonesItemsDraggingEnabled: false,
          dropzoneSelector: ".q-list",
          draggableSelector: ".q-item"
        }
      }
    },
    methods: {
      toggleOnSankey(cat) {
        currentNodes.includes(cat) ? currentNodes.remove(currentNodes.indexOf(cat)) : currentNodes.push(cat);
        console.log(currentNodes);
      },
      reordered(event, group) {
        // FIXME: corrigir isto amanhã; usar o event.detail.index
        console.log(event.detail.index);
        const reorderedItems = group.filter(
          item => event.detail.ids.map(Number).indexOf(item) >= 0
        );
        const newItems = group.filter(
          item => event.detail.ids.map(Number).indexOf(item) < 0
        );
        newItems.splice(event.detail.index, 0, ...reorderedItems);
        group = newItems;
        console.log(group);
      }
    }
}
</script>

<style lang="scss">
  .q-item[aria-grabbed="true"] {
    background-color: $secondary;
    color: white;
  }
  @keyframes nodeInserted {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 0.8;
    }
  }
  .item-dropzone-area {
    height: 2rem;
    background: #888;
    opacity: 0.8;
    animation-duration: 0.5s;
    animation-name: nodeInserted;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
  }
</style>