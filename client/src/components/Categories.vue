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
          <q-checkbox v-model="current.includes(cat)" @input="toggleOnSankey(cat)" color="primary" />
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
      },
      current: this.currentNodes,
      nodes: this.allNodes
    }
  },
  methods: {
    toggleOnSankey(cat) {
      if (this.current.includes(cat)) // remove element from sankey
        this.current = this.current.filter(d => d !== cat);
      else { // add element to sankey
        this.current.push(cat);
        this.current.sort((a, b) =>
          this.nodes.indexOf(a) - this.nodes.indexOf(b)
        );
      }
      this.checkedNodes = this.current;
      // spread current list to parent
      this.$emit("update-current", this.current);
    },
    reordered(event) {
      let item = event.detail.ids.map(Number)[0]; // element to be dragged
      let dragIndex = event.detail.index; // the position to be dragged

      // the node listing is cloned twice, since the new order will consist of 3 different arrays:
      let newGroup1 = JSON.parse(JSON.stringify(this.nodes));
      let newGroup2 = JSON.parse(JSON.stringify(this.nodes));

      if (item < dragIndex) // if the drag happens to the front
        this.nodes = [].concat(
          newGroup1.splice(0, dragIndex).filter(d => d !== this.nodes[item]),
          this.nodes[item],
          newGroup2.splice(dragIndex)
        );
      else // if the drag happens to the back
        this.nodes = [].concat(
          newGroup1.splice(0, dragIndex),
          this.nodes[item],
          newGroup2.splice(dragIndex).filter(d => d !== this.nodes[item])
        );
      // the checked nodes must be sorted by the same order
      this.checkedNodes.sort((a, b) =>
        this.nodes.indexOf(a) - this.nodes.indexOf(b)
      );
      // the entire node list must be sorted by the same order
      this.allNodes.sort((a, b) =>
        this.nodes.indexOf(a) - this.nodes.indexOf(b)
      );
      // the new node order is then spread to the parent (Sankey.vue)
      this.$emit("update-order", this.nodes);
      this.$emit("update-current", this.checkedNodes);
    }
  },
  computed: {
    checkedNodes: {
      get() {
        return this.current;
      },
      set(update) {
        this.current = update;
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