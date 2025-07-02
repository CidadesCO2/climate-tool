// Debug using browser console pressing F12
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, ButtonGroup, Table, ProgressBar } from 'react-bootstrap';
import './App.css'; // Import custom CSS for additional styling
import logo from "C:/Users/Filipa/Documents/climate-tool/src/logo-in-mais.png";
import logoCpC from "C:/Users/Filipa/Documents/climate-tool/src/CpC-logo.png";

//C:\Users\Filipa\Documents\climate-tool

function App() {
  // State variables
  const [screen, setScreen] = useState(null); // Current screen (null, "Indicadores", "Simular")
  const [activeCategory, setActiveCategory] = useState("Indicadores Ambientais"); // Active category for Indicadores
  const [activeCriterionInfo, setActiveCriterionInfo] = useState(null); // Active criterion info

  // Criteria grouped by category
  const criteriaCategories = {
    "Indicadores Ambientais": [
      "Remoção de CO₂",
      "Regulação climática",
      "Melhoria da qualidade do ar",
      "Contribuição para a biodiversidade",
      "Melhoria da qualidade/capacidade de retenção de água",
      "Melhoria da fertilidade/qualidade do solo", 
    ],
    "Indicadores Sociais": [
      "Bem-estar",
      "Coesão social",
      "Educação ambiental",
    ],
    "Indicadores Tecno-Económicos": [
      "Maturidade tecnológica",
      "CAPEX",
      "Custo marginal de abatimento de CO₂",
      "Criação de emprego",
    ],
  };

  const [criteria, setCriteria] = useState([
    "Remoção de CO₂",
    "Regulação climática",
    "Melhoria da qualidade do ar",
    "Contribuição para a biodiversidade",
    "Melhoria da qualidade/capacidade de retenção de água",
    "Melhoria da fertilidade/qualidade do solo",
    "Bem-estar",
    "Coesão social",
    "Educação ambiental",
    "Maturidade tecnológica",
    "CAPEX",
    "Custo marginal de abatimento de CO₂",
    "Criação de emprego"
    
    
  ]); // List of criteria
  const [activeSolutionInfo, setActiveSolutionInfo] = useState(null);
  const [solutions, setSolutions] = useState([]); // List of solutions
  const [currentStep, setCurrentStep] = useState(0); // Current step in the simulation
  const [comparisons, setComparisons] = useState({}); // Comparisons between criteria
  const [selectedValues, setSelectedValues] = useState({}); // Selected values for comparisons
  const [finalScores, setFinalScores] = useState([]); // Final scores for solutions
  const [weights, setWeights] = useState([]); // Weights for criteria
  const [columnWidth, setColumnWidth] = useState(0); // Column width for the table

  // Hardcoded default solutions
  const defaultSolutions = [
    {
      name: "Parques urbanos",
      scores: [3, 4, 4, 4, 4, 3, 5, 4, 5, 5, 3, 3, 3],
      description: "Espaços verdes em áreas urbanas que ajudam a capturar CO₂ através da vegetação, melhoram a qualidade do ar e proporcionam benefícios sociais e ecológicos."
    },
    {
      name: "Árvores de arruamento",
      scores: [3, 4, 3, 3, 3, 2, 4, 3, 4, 5, 3, 3, 3],
      description: "Árvores plantadas ao longo de ruas e avenidas que sequestram carbono, reduzem o efeito de ilha de calor e melhoram o ambiente urbano."
    },
    {
      name: "Telhados e paredes verdes",
      scores: [2, 3, 2, 3, 3, 2, 3, 3, 4, 4, 3, 4, 4],
      description: "Superfícies de edifícios cobertas com vegetação que absorvem CO₂, isolam termicamente os edifícios e aumentam a biodiversidade urbana."
    },
    {
      name: "Hortas urbanas",
      scores: [1, 3, 2, 3, 3, 4, 5, 5, 5, 5, 2, 2, 1],
      description: "Espaços agrícolas em zonas urbanas que capturam carbono no solo e nas plantas, promovem a produção local de alimentos e reduzem emissões associadas ao transporte."
    },
    {
      name: "Florestas autóctones",
      scores: [2, 5, 5, 5, 5, 5, 5, 4, 3, 5, 1, 1, 1],
      description: "Florestas compostas por espécies nativas que sequestram carbono de forma sustentável, promovem a biodiversidade e são mais resilientes a pragas e alterações climáticas."
    },
    {
      name: "Florestas de monoculturas",
      scores: [3, 4, 3, 2, 2, 2, 3, 2, 2, 5, 1, 1, 3],
      description: "Florestas plantadas com uma única espécie (geralmente para fins comerciais) que capturam carbono, mas com menor biodiversidade e maior vulnerabilidade ecológica."
    },
    {
      name: "Sistemas agroflorestais",
      scores: [1, 4, 4, 4, 4, 5, 4, 3, 3, 5, 1, 1, 2],
      description: "Integração de árvores e culturas agrícolas no mesmo espaço, promovendo o sequestro de carbono no solo e na biomassa, além de melhorar a produtividade e a resiliência dos sistemas agrícolas."
    },
    {
      name: "Zonas húmidas",
      scores: [2, 5, 4, 5, 5, 4, 5, 4, 3, 4, 2, 1, 1],
      description: "Ecossistemas como pântanos e sapais que armazenam grandes quantidades de carbono no solo saturado de água, sendo cruciais para a mitigação climática e conservação da biodiversidade."
    },
    {
      name: "Biocarvão",
      scores: [4, 2, 2, 3, 4, 4, 2, 2, 2, 3, 4, 3, 5],
      description: "Carvão vegetal produzido a partir de biomassa e aplicado ao solo, onde armazena carbono por longos períodos e melhora a fertilidade do solo."
    },
    {
      name: "Biomateriais",
      scores: [4, 3, 2, 1, 2, 2, 3, 2, 2, 4, 4, 3, 5],
      description: "Materiais de construção ou produtos feitos a partir de biomassa (como madeira, cânhamo ou micélio) que armazenam carbono durante o seu ciclo de vida."
    },
    {
      name: "Captura e armazenamento direto de carbono no ar (DACCS)",
      scores: [5, 1, 5, 1, 1, 1, 2, 1, 3, 2, 5, 5, 2],
      description: "Tecnologia que remove CO₂ diretamente da atmosfera usando processos químicos e o armazena de forma segura, geralmente em formações geológicas."
    },
    {
      name: "Bioenergia com captura e armazenamento de carbono (BECCS)",
      scores: [4, 1, 5, 1, 1, 1, 2, 1, 3, 2, 5, 5, 2],
      description: "Combinação da produção de energia a partir de biomassa com a captura e armazenamento do CO₂ emitido, resultando em emissões líquidas negativas."
    },
  ];

  // Initialize solutions with default solutions on component mount
  useEffect(() => {
    setSolutions(defaultSolutions);
  }, []); // Empty dependency array to run only once

  // Calculate column width based on the number of criteria
  useEffect(() => {
    const totalWidth = 1000; // Total width for the table
    const numColumns = criteria.length + 1; // Number of columns (criteria + solution column)
    setColumnWidth(totalWidth / numColumns);
  }, [criteria.length]);

  // Reset solutions to default values
  const resetToDefault = () => {
    setSolutions([...defaultSolutions]);
  };

  // Mapping of comparison values to weights
  const valueToWeight = {
    1: 7,
    2: 5,
    3: 3,
    4: 1,
    5: 0.333,
    6: 0.2,
    7: 0.143
  };

  // Handle changes in criterion comparisons
  const handleComparisonChange = (criterion1, criterion2, value) => {
    const comparisonValue = valueToWeight[value];
    setComparisons({
      ...comparisons,
      [`${criterion1}-${criterion2}`]: comparisonValue,
      [`${criterion2}-${criterion1}`]: 1 / comparisonValue
    });
    setSelectedValues({
      ...selectedValues,
      [`${criterion1}-${criterion2}`]: value
    });
  };

  // Move to the next step in the simulation
  const nextStep = () => {
    if (currentStep < criteria.length * (criteria.length - 1) / 2 - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateFinalScores();
      setCurrentStep(currentStep + 1); // Move to the next step to display final scores
    }
  };

  // Calculate final scores for solutions based on criteria weights
  const calculateFinalScores = () => {
    const matrix = Array(criteria.length).fill(null).map(() => Array(criteria.length).fill(1));
    criteria.forEach((criterion1, i) => {
      criteria.forEach((criterion2, j) => {
        if (i !== j) {
          const comparison = comparisons[`${criterion1}-${criterion2}`] || 1;
          matrix[i][j] = comparison;
          matrix[j][i] = 1 / comparison;
        }
      });
    });

    // Calculate weights for each criterion
    const weights = matrix.map(row => row.reduce((a, b) => a + b, 0) / criteria.length);
    console.log("Computed Weights for Each Criterion:", weights);
    setWeights(weights);

    const scores = solutions.map(solution => {
      const finalScore = solution.scores.reduce((acc, score, index) => {
        return acc + score * weights[index];
      }, 0);
      return { name: solution.name, score: finalScore };
    });

    // Sort the solutions by their final scores in descending order
    scores.sort((a, b) => b.score - a.score);

    setFinalScores(scores);
  };

  // Reset the comparison process
  const resetComparison = () => {
    setCurrentStep(0);
    setComparisons({});
    setSelectedValues({});
    setFinalScores([]);
    setWeights([]);
    setScreen(null);
  };

  // Render the simulation screen
  const renderSimular = () => {
    const totalComparisons = criteria.length * (criteria.length - 1) / 2;
    const progress = (currentStep / totalComparisons) * 100;

    if (currentStep >= totalComparisons) {
      return (
        <Container className="mt-4">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 rounded-lg shadow-md mb-6">
            <h1 className="text-4xl font-bold drop-shadow-md" style={{ color: "white" }}>
              Simulador de Decisão de Estratégias de Remoção de CO₂
            </h1>
          </div>
          <br />
          <h3 className="mb-4">Pesos Calculados</h3>
          {weights.length > 0 && criteria.map((criterion, index) => (
            <div key={index} className="card">
              <div className="card-title">
                 <span dangerouslySetInnerHTML={{ __html: criterion }} />
              </div>
              <div className="card-score">
                Peso: {weights[index].toFixed(2)}
              </div>
            </div>
            ))}
          <br />
          <h3 className="mb-4">Soluções e Pontuações</h3>
          {finalScores.map((solution, index) => (
            <div key={index} className="card">
              <div className="card-title">
                {index === 0 ? '🏆' : '🔹' } {solution.name}
              </div>
              <div className="card-score">
                Pontuação: {solution.score.toFixed(2)}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Button className="common-button" onClick={() => setScreen(null)}>Voltar</Button>
            <Button className="common-button" onClick={resetComparison}>Recomeçar</Button>
          </div>
        </Container>
      );
    }

    const combinations = [];
    for (let i = 0; i < criteria.length; i++) {
      for (let j = i + 1; j < criteria.length; j++) {
        combinations.push([criteria[i], criteria[j]]);
      }
    }

    const [criterion1, criterion2] = combinations[currentStep];

    const marks = {
      1: 'Muito mais importante',
      2: 'Mais importante',
      3: 'Ligeiramente mais importante',
      4: 'Igual importância',
      5: 'Ligeiramente mais importante',
      6: 'Mais importante',
      7: 'Muito mais importante'
    };

    const selectedValue = selectedValues[`${criterion1}-${criterion2}`];

    return (
      <Container className="mt-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 rounded-lg shadow-md mb-6">
            <h1 className="text-4xl font-bold drop-shadow-md" style={{ color: "white" }}>
              Simulador de Decisão de Estratégias de Remoção de CO₂
            </h1>
        </div>
        <br />
        <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
        <p className="mb-4">Na decisão de uma estratégia de remoção de carbono no seu município, o que é mais importante?</p>
        <Row className="justify-content-between mb-2">
          <Col xs="4" className="text-end pe-5">
            <label className="fw-bold" style={{ whiteSpace: "nowrap" }}>{criterion1}</label>
          </Col>
          <Col xs="4" className="text-start ps-5">
            <label className="fw-bold" style={{ whiteSpace: "nowrap" }}>{criterion2}</label>
          </Col>
        </Row>

        <Row className="align-items-center justify-content-center mb-4">
          <Col xs="12" className="text-center d-flex justify-content-center flex-wrap">
          <ButtonGroup>
            {Object.keys(marks).map((key, index) => (
              <Button
                key={key}
                variant={
                  selectedValue === parseInt(key)
                    ? "primary"
                    : index === Math.floor(Object.keys(marks).length / 2) // Check if it's the center button
                    ? "secondary" // Grey button
                    : "outline-primary"
                }
                onClick={() => handleComparisonChange(criterion1, criterion2, parseInt(key))}
                style={{
                  maxWidth: "100px",
                  padding: "4px 8px",
                  fontSize: "0.8rem",
                  whiteSpace: "normal",
                }}
                className="mx-1 text-center"
              >
                {marks[key]}
              </Button>
            ))}
          </ButtonGroup>

          </Col>
        </Row>


        <Button className="common-button" onClick={() => setScreen(null)}>Voltar</Button>        
        <Button className="common-button" onClick={resetComparison}>Recomeçar</Button>
        <Button className="main-menu-button" onClick={nextStep}>Próximo</Button>
      </Container>
    );
  };

  // Handle changes in solution scores
  const handleScoreChange = (solutionIndex, scoreIndex, newValue) => {
    const value = Math.max(1, Math.min(5, parseInt(newValue) || 1)); // Restrict value to 1-5
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].scores[scoreIndex] = value;
    setSolutions(updatedSolutions);
  };

  // Render the definitions screen
  const renderDefinicoes = () => {
    // Get the criteria for the active category
    const activeCriteria = criteriaCategories[activeCategory];

    // Ranges and explanations for each indicator (from criteria_scores.csv)
    const criteriaInfo = {
      "Remoção de CO₂": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Quantidade de CO₂ retirada da atmosfera por uma determinada solução de base natural ou tecnológica, contribuindo para a mitigação das alterações climáticas.",
      },
      "Regulação climática": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Benefícios adicionais na regulação local ou regional do clima (p. ex.: arrefecimento urbano).",
      },
      "Melhoria da qualidade do ar": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Melhorias na qualidade do ar, como redução de poluentes e partículas.",
      },
      "Contribuição para a biodiversidade": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Capacidade de proteger ou aumentar a diversidade de espécies e habitats e promoção da conectividade ecológica.",
      },
      "Melhoria da qualidade/capacidade de retenção de água": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Impacto na qualidade da água, retenção hídrica e mitigação de cheias.",
      },
      "Melhoria da fertilidade/qualidade do solo": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Efeitos na saúde e fertilidade do solo (p. ex.: teor de matéria orgânica, nutrientes).",
      },
      "Bem-estar": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Melhoria do bem-estar local/comunitário (p. ex.: benefícios para a saúde física e mental).",
      },
      "Coesão social": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Contributo para a inclusão social, interação comunitária e fortalecimento do sentido de pertença.",
      },
      "Educação ambiental": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Potencial para promover conhecimentos e consciencialização ambiental.",},
      "Maturidade tecnológica": {
       numericRange: "1-5",
       textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
       explanation: "Nível de prontidão tecnológica, indicando quão desenvolvida ou pronta para aplicação está uma solução. Métrica: Normalmente classificada numa escala de 1–11 pela IEA, em que valores mais altos significam maior maturidade. TRL significa Technological Readiness Level.",
      },
      "CAPEX": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Investimento inicial para implementar a solução, distribuído pelo CO₂ removido/evitado. Métrica: Euros por tonelada de CO₂.",
      },
      "Custo marginal de abatimento de CO₂": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "Custo total, inicial e manutenção, do projeto para sequestrar cada tonelada de CO₂. Métrica: Euros por tonelada de CO₂.",
      },
      "Criação de emprego": {
        numericRange: "1-5",
        textRange: "Nulo, Baixo, Moderado, Alto, Muito Alto",
        explanation: "O impacto na geração de postos de trabalho, tendo em conta a quantidade de CO₂ reduzido/remoção. Métrica: FTE (Full-Time Equivalent) por tonelada de CO₂ ou indicador qualitativo se não existirem dados.",
      },
        };

    return (
      <Container className="mt-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 rounded-lg shadow-md mb-6">
          <h1 className="text-4xl font-bold drop-shadow-md" style={{ color: "white" }}>
            Indicadores
          </h1>
        </div>
        <br />
        {/* Instructional Text */}
        <p className="text-gray-700 mb-4">
          Para saber mais sobre a escala 1-5 e o que significa cada critério, clique no botão "i". Para alterar a classificação de alguma estratégia, mova o cursor para a célula desejada e utilize as setas que aparecem.
        </p>
        {/* Category Buttons */}
        <div className="mb-4">
          <Button
            className={`common-button ${activeCategory === "Indicadores Ambientais" ? "active" : ""}`}
            onClick={() => setActiveCategory("Indicadores Ambientais")}
          >
            Indicadores Ambientais
          </Button>
          <Button
            className={`common-button ${activeCategory === "Indicadores Sociais" ? "active" : ""}`}
            onClick={() => setActiveCategory("Indicadores Sociais")}
          >
            Indicadores Sociais
          </Button>
          <Button
            className={`common-button ${activeCategory === "Indicadores Tecno-Económicos" ? "active" : ""}`}
            onClick={() => setActiveCategory("Indicadores Tecno-Económicos")}
          >
            Indicadores Tecno-Económicos
          </Button>
        </div>
        {/* Table */}
        <Table striped bordered hover className="shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 text-center">
            <tr>
              <th style={{ width: `${columnWidth}px` }}>Estratégia de remoção de CO₂</th>
              {activeCriteria.map((criterion, index) => (
                <th key={index} style={{ width: `${columnWidth}px` }}>
                  <span dangerouslySetInnerHTML={{ __html: criterion }} />
                  <button
                    className="p-0 ms-2 grey-info-btn"
                    onClick={() => setActiveCriterionInfo(criteriaInfo[criterion])}
                    type="button"
                  >
                    ℹ️
                  </button>
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution, solutionIndex) => (
              <tr key={solutionIndex}>
                <td className="font-semibold p-2" style={{ width: `${columnWidth}px` }}>
                  {solution.name}
                  <button
                    className="p-0 ms-2 grey-info-btn"
                    onClick={() => setActiveSolutionInfo(solution)}
                    type="button"
                  >
                    ℹ️
                  </button>
                  </td>
                {solution.scores
                  .slice(
                    criteria.indexOf(activeCriteria[0]),
                    criteria.indexOf(activeCriteria[0]) + activeCriteria.length
                  )
                  .map((score, scoreIndex) => (
                    <td key={scoreIndex} className="font-semibold p-2" style={{ width: `${columnWidth}px` }}>
                      <input
                        type="number"
                        value={score}
                        min="1"
                        max="5"
                        onChange={(e) => handleScoreChange(solutionIndex, criteria.indexOf(activeCriteria[0]) + scoreIndex, e.target.value)}
                        className="transparent-input"
                      />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <Button className="main-menu-button" onClick={() => setScreen(null)}>Voltar</Button>
          <Button className="main-menu-button" onClick={resetToDefault}>Valores Padrão</Button>
        </div>
        {/* Modal for Criterion Info */}
        {activeCriterionInfo && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Informação sobre o indicador</h5>
                  <button type="button" className="close" onClick={() => setActiveCriterionInfo(null)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p><strong>Pontuação:</strong> {activeCriterionInfo.numericRange}</p>
                  <p><strong>Classificação qualitativa:</strong> {activeCriterionInfo.textRange}</p>
                  <p><strong>Definição:</strong> {activeCriterionInfo.explanation}</p>
                </div>
                <div className="modal-footer">
                  <Button variant="secondary" onClick={() => setActiveCriterionInfo(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeSolutionInfo && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Informação sobre a estratégia</h5>
                  <button type="button" className="close" onClick={() => setActiveSolutionInfo(null)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p><strong>Nome:</strong> {activeSolutionInfo.name}</p>
                  <p><strong>Descrição:</strong> {activeSolutionInfo.description}</p>
                </div>
                <div className="modal-footer">
                  <Button variant="secondary" onClick={() => setActiveSolutionInfo(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
      )}
      </Container>
    );
  };

  return (
    <div className="App text-center p-4">
      {!screen ? (
        <div>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-6 rounded-lg shadow-md mb-6">
            <h1 className="text-4xl font-bold drop-shadow-md" style={{ color: "white" }}>
              Simulador de Decisão de Estratégias de Remoção de CO₂
            </h1>
          </div>
          <br />
          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <Button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition" onClick={() => setScreen("Indicadores")}>
              Indicadores
            </Button>
            <Button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition" onClick={() => setScreen("Simular")}>
              Simular
            </Button>
          </div>
          <br />
          {/* Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
              <h2 className="text-xl font-bold mb-2">ℹ️ Sobre a Ferramenta</h2>
              <p className="text-gray-600 leading-relaxed">
                Esta ferramenta de apoio à decisão foi desenvolvida para avaliar estratégias de remoção de dióxido de carbono (CO₂) em contextos urbanos, considerando critérios ambientais, sociais e teco-económicos. A abordagem multicritério permite comparar as diferentes estratégias de forma estruturada e transparente, integrando diferentes dimensões, com o objetivo de apoiar decisões mais informadas e adaptadas ao território.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
              <h2 className="text-xl font-bold mb-2">⚙️ Como funciona o método AHP?</h2>
              <p className="text-gray-600 leading-relaxed">
                O método baseia-se em comparações par a par entre critérios, através das quais se determina a sua importância relativa. Os pesos resultantes são usados para avaliar e classificar as estratégias de acordo com o seu desempenho face aos critérios definidos.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
              <h2 className="text-xl font-bold mb-2">📋 O que pode fazer em "Indicadores"?</h2>
              <p className="text-gray-600 leading-relaxed">
                Na secção “Indicadores”, é possível visualizar e ajustar as classificações dos diferentes critérios das estratégias. Cada estratégia tem pontuações associadas aos critérios de avaliação, que podem ser editadas manualmente. Existe também a opção de restaurar os valores predefinidos.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
              <h2 className="text-xl font-bold mb-2">🔍 O que pode fazer em "Simular"?</h2>
              <p className="text-gray-600 leading-relaxed">
                Na secção “Simular”, será guiado por um conjunto de comparações sobre os pesos de cada critério. Com base nas suas escolhas, o simulador calcula os pesos relativos e apresenta uma classificação das estratégias, destacando aquelas que melhor respondem aos objetivos definidos.
              </p>
            </div>
            
          </div>
        </div>
      ) : (
        <div>
          {screen === "Indicadores" && renderDefinicoes()}
          {screen === "Simular" && renderSimular()}
        </div>
      )}
      <br />
      <br />
      {/* Logos at the Bottom Center */}
      <div className="flex justify-center items-center gap-4 fixed bottom-4 left-1-2 transform -translate-x-1/2">
        <img src={logo} alt="Logo 1" className="w-24 h-auto" />
        <img src={logoCpC} alt="Logo 2" className="w-24 h-auto" />
      </div>
    </div>
  );
}

export default App;