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
    filters.toApply = filters.gender;
    renewCharts(filterDataByGender.name);
}

function filterDataByAge(age1, age2) {
    currentAge1 = parseInt(age1);
    currentAge2 = parseInt(age2);
    var myFilter = filters.gender.length ? filters.gender : els;
    if (currentAge1 < currentAge2) {
        filters.age = myFilter.filter((d) => d.Q2_Idade >= age1 && d.Q2_Idade <= age2);
        filters.toApply = filters.age;
        renewCharts(filterDataByAge.name);
    }
}

function filterDataByTraits(trait, value1, value2) { // FIXME: a different array for each trait, perhaps?
    var myFilter = filters.toApply;
    if (value1 < value2) {
        switch (trait) {
            case 0:
                filters.traits.push(myFilter.filter((d) => d.Neuroticismo_NEOFFI >= value1 && d.Neuroticismo_NEOFFI <= value2));
                currentNeuroticism1 = parseInt(value1);
                currentNeuroticism2 = parseInt(value2);
                break;
            case 1:
                filters.traits.push(myFilter.filter((d) => d.Extroversão_NEOFFI >= value1 && d.Extroversão_NEOFFI <= value2));
                currentExtraversion1 = parseInt(value1);
                currentExtraversion2 = parseInt(value2);
                break;
            case 2:
                filters.traits.push(myFilter.filter((d) => d.AberturaExperiência_NEOFFI >= value1 && d.AberturaExperiência_NEOFFI <= value2));
                currentOpenness1 = parseInt(value1);
                currentOpenness2 = parseInt(value2);
                break;
            case 3:
                filters.traits.push(myFilter.filter((d) => d.AmabIilidade_NEOFFI >= value1 && d.AmabIilidade_NEOFFI <= value2));
                currentAgreeableness1 = parseInt(value1);
                currentAgreeableness2 = parseInt(value2);
                break;
            case 4:
                filters.traits.push(myFilter.filter((d) => d.Conscienciosidade_NEOFFI >= value1 && d.Conscienciosidade_NEOFFI <= value2));
                currentConscientiousness1 = parseInt(value1);
                currentConscientiousness2 = parseInt(value2);
                break;
        }
        filters.toApply = filters.traits[filters.traits.length - 1];
        console.log(filters.toApply);
        renewCharts(filterDataByTraits.name);
    }
}

function renewCharts(funcName) {
    if (funcName === filterDataByGender.name)
            filterDataByAge(currentAge1, currentAge2);
    d3.select("#scatter").select("svg").remove();
    d3.select("#parallel").select("#chart").select("svg").remove();
    d3.select("#boxplot").select("svg").remove();
    drawParallel(filters.toApply);
    drawScatter(filters.toApply);
    drawBoxplot(filters.toApply);
    drawHistogram(filters.toApply, histogramIndex);
}