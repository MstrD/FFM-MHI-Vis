function highlightSubject(subj) {
    this.$root.$emit('highlightParallel', subj);
    this.$root.$emit('highlightHistogram', subj);
    this.$root.$emit('highlightBoxplot', subj);
    this.$root.$emit('highlightViolin', subj);
    this.$root.$emit('highlightSankey', subj);
    this.$root.$emit('drawHeatmap', subj);
}

function dehighlightSubject(subj) {
    this.$root.$emit('dehighlightParallel', subj);
    this.$root.$emit('dehighlightHistogram', subj);
    this.$root.$emit('dehighlightBoxplot', subj);
    this.$root.$emit('dehighlightViolin', subj);
    this.$root.$emit('dehighlightSankey');
    this.$root.$emit('removeHeatmap');
}

function dehighlightAllSubjects() {
    this.$root.$emit('dehighlightAllParallel');
}

export { highlightSubject, dehighlightSubject, dehighlightAllSubjects };