(() => {
  const p_A = PRE_Answers.split("\n");
  const p_C = PRE_Categories.split("\n");
  const p_D = PRE_Diches.split("\n");
  const p_N = PRE_Names.split("\n");
  const p_T = PRE_Titles.split("\n");
  const p_I = PRE_Index.split("\n");
  const p_O = PRE_Orders.split("\n");

  const p_R = Object.fromEntries(PRE_Results.trim().split("_\n").map((value, index) => {
    let array = value.trim().split("\n");
    return [
      array[0].trim(),
      {
        name: array[1].trim(),
        description: array[3].trim(),
        attributes: array[2].trim().split(","),
      }];
  }));

  const createQuestion = (num, title, label1, key1, label2, key2, props) => {
    return {
      id: num,
      title: title,
      choices: [{label: label1, key:key1}, {label: label2, key:key2}],
      props: props
    };
  };
  const calculateResults = (answers) => {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] == "E") counter.E++;
      if (answers[i] == "S") counter.S++;
      if (answers[i] == "T") counter.T++;
      if (answers[i] == "J") counter.J++;
    }
    let personality = `${(counter.E/5 > 0.5) ? "E" : "I"}${(counter.S/7 > 0.5) ? "S" : "N"}${(counter.T/5 > 0.5) ? "T" : "F"}${(counter.J/7 > 0.5) ? "J" : "P"}`;
    return personality;
  };
  const mapRange = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

  const counter = {
    E: 0,
    S: 0,
    T: 0,
    J: 0,
  };
  
  const categories = {
    Sky: {
      category: "Cities & Sky",
      tone: 4
    },
    Signs: {
      category: "Cities & Signs",
      tone: 2
    },
    Names: {
      category: "Cities & Names",
      tone: 2
    },
    Continuous: {
      category: "Cities & Continuous",
      tone: 3
    },
    Eyes: {
      category: "Cities & Eyes",
      tone: 1
    },
    Memory: {
      category: "Cities & Memory",
      tone: 1
    },
    Thin: {
      category: "Cities & Thin",
      tone: 3
    },
    Desire: {
      category: "Cities & Desire",
      tone: 4
    },
  };

  const q = p_N.map((value, index) => {
    return createQuestion(
      Number.parseInt(p_I[index]),
      p_T[index*2+1],
      p_A[index*2], p_D[index*2],
      p_A[index*2+1], p_D[index*2+1],
      {
        ...categories[ p_C[index].split(" & ")[1] ],
        order: Number.parseInt(p_O[index]),
        description: p_T[index*2],
        city: value,
      }
    );
  }).sort((a,b) => a.id > b.id);

  window.currentQuestionIndex = 0;

  document.addEventListener('alpine:init', () => {
    Alpine.store('results', p_R);
    Alpine.store('questions', q);
    Alpine.store('calculateResults', calculateResults);
    Alpine.store('createQuestion', createQuestion);
  });

})();