<template>
  <div class="q-pa-md q-gutter-md categories" v-drag-and-drop:options="options">
    <q-list
      dense
      padding
      class="rounded-borders"
      style="max-width: 300px"
      @reordered="reordered($event)"
    >
      <q-item-label header>Sociodemographic Factors</q-item-label>
      <q-item-label class="q-ml-md q-mb-sm" caption>Select and reorder elements</q-item-label>
      <q-separator />
      <q-item clickable v-ripple v-for="(cat, index) in allNodes" :key="cat" :data-id="index">
        <q-item-section>
          {{ cat }}
        </q-item-section>
        <q-item-section side>
          <q-checkbox v-model="checkedNodes.includes(cat)" @input="toggleOnSankey(cat)" color="primary" />
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
    toggleOnSankey(cat) { // FIXME: as well
      let current = this.checkedNodes; // cloned var to not use the prop
      let nodes = this.allNodes; // cloned var to not use the prop

      if (current.includes(cat)) // remove element from sankey
        current = current.filter(d => d !== cat);
      else { // add element to sankey
        current.push(cat);
        current.sort(function(a, b) {
          return nodes.indexOf(a) - nodes.indexOf(b);
        });
      }
      this.checkedNodes = current;
      // spread current list to parent
      this.$emit("update-current", current);
    },
    reordered(event) {
      let nodes = this.allNodes; // cloned var to not use the prop

      let item = event.detail.ids.map(Number)[0]; // element to be dragged
      let dragIndex = event.detail.index; // the position to be dragged

      // the node listing is cloned twice, since the new order will consist of 3 different arrays:
      let newGroup1 = JSON.parse(JSON.stringify(nodes));
      let newGroup2 = JSON.parse(JSON.stringify(nodes));

      if (item < dragIndex) // if the drag happens to the front
        nodes = [].concat(
          newGroup1.splice(0, dragIndex).filter(d => d !== nodes[item]),
          nodes[item],
          newGroup2.splice(dragIndex)
        );
      else // if the drag happens to the back
        nodes = [].concat(
          newGroup1.splice(0, dragIndex),
          nodes[item],
          newGroup2.splice(dragIndex).filter(d => d !== nodes[item])
        );
      // the checked nodes must be sorted by the same order
      this.checkedNodes.sort(function(a, b) {
        return nodes.indexOf(a) - nodes.indexOf(b);
      });
      // the entire node list must be sorted by the same order
      this.allNodes.sort(function(a, b) {
        return nodes.indexOf(a) - nodes.indexOf(b);
      });

      // the new node order is then spread to the parent (Sankey.vue)
      this.$emit("update-order", nodes);
    }
  },
  computed: {
    checkedNodes: {
      get() {
        return this.currentNodes;
      },
      set(update) {
        this.currentNodes = update;
      }
    }
  },
}
</script>

<style lang="scss">
  .categories .q-item:hover {
    cursor: grab !important;
  }
  .categories .q-item[aria-grabbed="true"] {
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