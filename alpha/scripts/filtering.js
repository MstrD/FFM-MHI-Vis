function filterDataById(id) {
    filters.toApply = els.filter((d) => d.Nº === id);
    renewCharts(filterDataById.name);
    filters.toApply = els;
}

function filterDataByGender(gender) {
    if (filters.gender.length)
        filters.gender = [];
    switch (gender) {
        case 'male':
            filters.gender = els.filter((d) => d.Q1_Sexo === 1);
            break;
        case 'female':
            filters.gender = els.filter((d) => d.Q1_Sexo === 2);
            break;
    }
    filters.toApplyGenderAndAge = filters.gender;
    filters.toApply = filters.gender;
    renewCharts(filterDataByGender.name);
}

function filterDataByAge(age1, age2, toRenew) {
    var myFilter = filters.gender.length ? filters.gender : els;
    if (age1 < age2) {
        currentAge1 = age1;
        currentAge2 = age2;
        filters.age = myFilter.filter((d) => d.Q2_Idade >= age1 && d.Q2_Idade <= age2);
        filters.toApplyGenderAndAge = filters.age;
        filters.toApply = filters.age;
        if (toRenew)
            renewCharts(filterDataByAge.name);
    }
}

function filterDataByTraits(trait, value1, value2) { // FIXME: a different array for each trait, perhaps?
    var myFilter = filters.toApplyGenderAndAge;
    if (value1 < value2 && (value1 !== 0 || value2 !== 48)) {
        switch (trait) {
            case 0:
                filters.traits.neuroticism = myFilter.filter((d) => d.Neuroticismo_NEOFFI >= value1 && d.Neuroticismo_NEOFFI <= value2);
                currentNeuroticism1 = value1;
                currentNeuroticism2 = value2;
                filters.toApply = filters.traits.neuroticism;
                break;
            case 1:
                filters.traits.extraversion = myFilter.filter((d) => d.Extroversão_NEOFFI >= value1 && d.Extroversão_NEOFFI <= value2);
                currentExtraversion1 = value1;
                currentExtraversion2 = value2;
                filters.toApply = filters.traits.extraversion;
                break;
            case 2:
                filters.traits.openness = myFilter.filter((d) => d.AberturaExperiência_NEOFFI >= value1 && d.AberturaExperiência_NEOFFI <= value2);
                currentOpenness1 = value1;
                currentOpenness2 = value2;
                filters.toApply = filters.traits.openness;
                break;
            case 3:
                filters.traits.agreeableness = myFilter.filter((d) => d.AmabIilidade_NEOFFI >= value1 && d.AmabIilidade_NEOFFI <= value2);
                currentAgreeableness1 = value1;
                currentAgreeableness2 = value2;
                filters.toApply = filters.traits.agreeableness;
                break;
            case 4:
                filters.traits.conscientiousness = myFilter.filter((d) => d.Conscienciosidade_NEOFFI >= value1 && d.Conscienciosidade_NEOFFI <= value2);
                currentConscientiousness1 = value1;
                currentConscientiousness2 = value2;
                filters.toApply = filters.traits.conscientiousness;
                break;
        }
        renewCharts(filterDataByTraits.name);
    }
    else {
        switch (trait) {
            case 0:
                filters.traits.neuroticism = [];
                break;
            case 1:
                filters.traits.extraversion = [];
                break;
            case 2:
                filters.traits.openness = [];
                break;
            case 3:
                filters.traits.agreeableness = [];
                break;
            case 4:
                filters.traits.conscientiousness = [];
                break;
        }
    }
}

function renewCharts(funcName) {
    if (funcName === filterDataByGender.name) {
        filterDataByAge(currentAge1, currentAge2, false);
        filterAllTraits();
    }
    if (funcName === filterDataByAge.name) {
        filterAllTraits();
    }
    // TODO: merge these charts instead of removing them
    d3.select("#parallel").select("#chart").select("svg").remove();
    d3.select("#boxplot").select("svg").remove();
    drawParallel(filters.toApply);
    drawScatter(filters.toApply, scatterIndex);
    drawBoxplot(filters.toApply);
    drawHistogram(filters.toApply, histogramIndex);
}

function filterAllTraits() {
    filterDataByTraits(0, currentNeuroticism1, currentNeuroticism2);
    filterDataByTraits(1, currentExtraversion1, currentExtraversion2);
    filterDataByTraits(2, currentOpenness1, currentOpenness2);
    filterDataByTraits(3, currentAgreeableness1, currentAgreeableness2);
    filterDataByTraits(4, currentConscientiousness1, currentConscientiousness2);
}