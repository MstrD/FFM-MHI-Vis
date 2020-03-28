function highlightSubject(subj) {
    this.$root.$emit('highlightParallel', subj);
    this.$root.$emit('highlightHistogram', subj);
    this.$root.$emit('highlightBoxplot', subj);

    this.$showUserInfo(subj);
}

function dehighlightSubject(subj) {
    this.$root.$emit('dehighlightParallel', subj);
    this.$root.$emit('dehighlightHistogram', subj);
    this.$root.$emit('dehighlightBoxplot');

    this.$hideUserInfo(subj);
    this.$root.$emit('removeHeatmap');
}

function dehighlightAllSubjects() {
    this.$root.$emit('dehighlightAllParallel');

    this.$hideUserInfo();
}

function showUserInfo(d) {
    this.$d3.select("#user_info").style("display", "inherit").append("div").attr("id", "list" + this.$getNumber(d)).html( 
    "<b>Subject:</b> #" + this.$getNumber(d) + ";</br>" + 
    "<b>Age:</b> " + this.$getAge(d) + ";</br>" +
    "<b>Gender:</b> " + this.$getGender(d) + ";</br>" +
    "<b>Residence:</b> " + this.$getResidence(d) + ";</br>" +
    "<b>Schooling Level:</b> " + this.$getSchooling(d) + ";</br>" +
    "<b>Work Status:</b> " + this.$getWorkStatus(d) + ";</br>" +
    "<b>Economical Status:</b> " + this.$getEconomicalStatus(d) + ";</br>" +
    "<b>Marital Status:</b> " + this.$getMaritalStatus(d) + ";</br>" +
    "<b>Household:</b> " + this.$getHousehold(d) + ";</br>" +
    "<b>Religion:</b> " + this.$getReligion(d) + ";</br>");
    this.$root.$emit('drawHeatmap', d);
}

function hideUserInfo(d) {
    if (!d) {
        this.$d3.select("#parallel").select("#user_info").select("#list").remove();
        this.$d3.select("#parallel").select("#user_info").style("display", "none");
    }
    else {
        this.$d3.select("#parallel").select("#user_info").select("#list" + this.$getNumber(d)).remove();
        // TODO: remove #user_info when there are no more subjects selected
    }
}

export { highlightSubject, dehighlightSubject, dehighlightAllSubjects,
         showUserInfo, hideUserInfo };