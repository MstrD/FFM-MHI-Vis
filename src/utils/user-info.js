function getNumber(d) {
    return d.Nº;
}

function getAge(d) {
    return d.Q2_Idade;
}

function getGender(d) {
    return (typeof(d) === Object ? d.Q1_Sexo : d) ? "Male" : "Female";
}

function getResidence(d) {
    return (typeof(d) === Object ? d.Q4_Residência : d) === 1 ? "City" : "Countryside";
}

function getSchooling(d) {
    switch (typeof(d) === Object ? d.Q5_Ensino : d) {
        case 1:
            return "Primary School";
        case 2:
            return "4th Grade";
        case 3:
            return "6th Grade";
        case 4:
            return "Elementary School";
        case 5:
            return "High School";
        case 6:
            return "Graduation (or higher)";
    }
};

function getWorkStatus(d) {
    switch (typeof(d) === Object ? d.Q6_Profissão : d) {
        case 1:
            return "Employed";
        case 2:
            return "Unemployed";
        case 3:
            return "Retired";
        case 4:
            return "Housekeeper";
        case 5:
            return "Student";
    }
};

function getEconomicalStatus(d) {
    switch (typeof(d) === Object ? d.Q8_Situação_Económica : d) {
        case 1:
            return "Very Satisfying";
        case 2:
            return "Satisfying";
        case 3:
            return "Little Satisfying";
        case 4:
            return "Unsatisfying";
    }
};

function getMaritalStatus(d) {
    switch (typeof(d) === Object ? d.Q9_Estado_Civil : d) {
        case 1:
            return "Single";
        case 2:
            return "Married (or likewise)";
        case 3:
            return "Widower";
        case 4:
            return "Divorced/Separated";
    }
};

function getHousehold(d) {
    switch (typeof(d) === Object ? d.Q10_Agregado_Familiar : d) {
        case 1:
            return "Alone";
        case 2:
            return "With spouse";
        case 3:
            return "With spouse and third parties";
        case 4:
            return "With third parties";
        case 5:
            return "With parents";
        case 6:
            return "Other";
    }
};

function getReligion(d, other) {
    switch (typeof(d) === Object ? d.Q13_Religião : d) {
        case 1:
            return "Catholic (practicing)";
        case 2:
            return "Catholic (non-practicing)";
        case 3:
            if (typeof(d) === Object)
                return d.Descrição_Outra_Religião.charAt(0).toUpperCase() + d.Descrição_Outra_Religião.slice(1);
            else
                return other.charAt(0).toUpperCase() + other.slice(1);
        case 4:
            return "None";
    }
};

function getTraitQuestions() {
    let traits = {
        neuroticism: [],
        extraversion: [],
        openness: [],
        agreeableness: [],
        conscientiousness: []
    };
    for (let i = 1; i <= 60; i++) {
        switch (i % 5) {
            case 1:
                traits.neuroticism.push(i);
                continue;
            case 2:
                traits.extraversion.push(i);
                continue;
            case 3:
                traits.openness.push(i);
                continue;
            case 4:
                traits.agreeableness.push(i);
                continue;
            case 0:
                traits.conscientiousness.push(i);
                continue;
        }
    }
    return traits;
}

function getTraitAnswers(d) {
    let traits = [];
    for (let i = 1; i <= 60; i++) {
        switch (i % 5) {
            case 1:
                traits.push({
                    id: d.Nº,
                    trait: 'Neuroticism',
                    traitReduced: 'N',
                    question: Math.round(i / 5),
                    value: d[`NEOFF${i}`]
                });
                continue;
            case 2:
                traits.push({
                    id: d.Nº,
                    trait: 'Extraversion',
                    traitReduced: 'E',
                    question: Math.round(i / 5),
                    value: d[`NEOFF${i}`]
                });
                continue;
            case 3:
                traits.push({
                    id: d.Nº,
                    trait: 'Openness',
                    traitReduced: 'O',
                    question: Math.round(i / 5),
                    value: d[`NEOFF${i}`]
                });
                continue;
            case 4:
                traits.push({
                    id: d.Nº,
                    trait: 'Agreeableness',
                    traitReduced: 'A',
                    question: Math.round(i / 5),
                    value: d[`NEOFF${i}`]
                });
                continue;
            case 0:
                traits.push({
                    id: d.Nº,
                    trait: 'Conscientiousness',
                    traitReduced: 'C',
                    question: Math.round(i / 5),
                    value: d[`NEOFF${i}`]
                });
                continue;
        }
    }
    return traits;
}

function getTraitName(trait) {
    switch (trait) {
        case 0:
            return 'Neuroticism';
        case 1:
            return 'Extraversion';
        case 2:
            return 'Openness';
        case 3:
            return 'Agreeableness';
        case 4:
            return 'Conscientiousness';
        case 5:
            return 'MHI';
    }
}

function getCorrectTrait(d, trait) {
    switch (trait) {
        case 0:
            return d.Neuroticismo_NEOFFI;
        case 1:
            return d.Extroversão_NEOFFI;
        case 2:
            return d.AberturaExperiência_NEOFFI;
        case 3:
            return d.AmabIilidade_NEOFFI;
        case 4:
            return d.Conscienciosidade_NEOFFI;
        case 5:
            return d.MH5_total;
    }
}

export { 
    getNumber, getAge, getGender, getResidence, getSchooling, 
    getWorkStatus, getEconomicalStatus, getMaritalStatus, 
    getHousehold, getReligion, getTraitQuestions, 
    getTraitAnswers, getTraitName, getCorrectTrait
};