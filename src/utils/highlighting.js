function highlightSubject(subj, isFromLeftDrawer = false) {
    if (isFromLeftDrawer) {
        this.$root.$emit('highlightScatter', subj);
        this.$dehighlightAllSubjects();
        this.$root.$emit('dehighlightBoxplot', subj);
    }
    this.$root.$emit('highlightParallel', subj);
    this.$root.$emit('highlightHistogram', subj);
    this.$root.$emit('highlightBoxplot', subj);
    this.$root.$emit('highlightViolin', subj);
    this.$root.$emit('highlightSankey', subj);
    this.$root.$emit('drawHeatmap', subj);
}

function dehighlightSubject(subj, isFromLeftDrawer = false) {
    this.$root.$emit('dehighlightParallel', subj);
    this.$root.$emit('dehighlightHistogram', subj);
    this.$root.$emit('dehighlightBoxplot', subj);
    this.$root.$emit('dehighlightViolin', subj);
    this.$root.$emit('dehighlightSankey');
    this.$root.$emit('removeHeatmap');
    if (isFromLeftDrawer)
        this.$root.$emit('dehighlightScatter');
}

function dehighlightAllSubjects() {
    this.$root.$emit('dehighlightAllParallel');
    this.$root.$emit('dehighlightAllBoxplot');
}

export { highlightSubject, dehighlightSubject, dehighlightAllSubjects };