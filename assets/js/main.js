/*
==========================================================
 NeoGym — Aula 09: Analisador de turmas (dados -> classificar -> resumir)
==========================================================

 TEMA:          turmas de uma academia (musculação, spinning, yoga etc.)
 ENTRADA:       ocupação mínima (0 a 100) digitada com prompt, e depois
                nomes de turmas para consulta, até digitar "sair"
 PROCESSAMENTO: calcular a ocupação de cada turma, classificar em faixas
                (Lotada / Últimas vagas / Disponível), indicar a sala por
                modalidade e resumir o conjunto
 SAÍDA:         frases no console (template literal), relatório com
                console.table e um resumo final

 PSEUDOCÓDIGO:
   1. Declarar o array de turmas
   2. Pedir a ocupação mínima e validar (null, vazio, NaN, faixa)
   3. Para cada turma:
        calcular ocupação = inscritos / vagas * 100
        classificar em faixa (if / else if / else)
        descobrir a sala pela modalidade (switch)
        atualizar contador de lotadas, acumulador de vagas livres
        e a maior turma (máximo)
   4. Mostrar o relatório com console.table e o resumo
   5. Enquanto o usuário não digitar "sair", buscar a turma digitada

 TESTE DE MESA (3 primeiras voltas do for...of principal)
 ---------------------------------------------------------------------
 volta | turma             | ocupação | faixa          | lotadas | vagasLivres | maiorTurma
 ------|-------------------|----------|----------------|---------|-------------|--------------------
   1   | Musculação Manhã  |   95     | Últimas vagas  |    0    |  0 + 2  = 2 | Musculação Manhã (38)
   2   | Spinning Noite    |  100     | Lotada         |    1    |  2 + 0  = 2 | Musculação Manhã (38)
   3   | Funcional Tarde   |   48     | Disponível     |    1    |  2 + 13 = 15| Musculação Manhã (38)
 ---------------------------------------------------------------------
 (conferir com as 3 primeiras linhas que o console.log mostra)
*/

// ---------- 1. DADOS ----------
const turmas = [
  { nome: "Musculação Manhã",  modalidade: "musculacao",  vagas: 40, inscritos: 38 },
  { nome: "Spinning Noite",    modalidade: "spinning",    vagas: 20, inscritos: 20 },
  { nome: "Funcional Tarde",   modalidade: "funcional",   vagas: 25, inscritos: 12 },
  { nome: "Yoga Manhã",        modalidade: "yoga",        vagas: 15, inscritos: 14 },
  { nome: "Crossfit Noite",    modalidade: "crossfit",    vagas: 30, inscritos: 9 },
  { nome: "Alongamento Tarde", modalidade: "alongamento", vagas: 10, inscritos: 5 }
];

// ---------- 2. ENTRADA COM CONVERSÃO E VALIDAÇÃO ----------
function lerOcupacaoMinima() {
  const resposta = prompt("Ocupação mínima (0 a 100) para listar no relatório:");

  // Cancelar devolve null
  if (resposta === null) {
    alert("Entrada cancelada. Usando 0 (todas as turmas).");
    return 0;
  }

  // Number("") vira 0, então o vazio precisa ser testado antes
  if (resposta.trim() === "") {
    alert("Nenhum valor digitado. Usando 0 (todas as turmas).");
    return 0;
  }

  const numero = Number(resposta);

  if (Number.isNaN(numero)) {
    alert("Digite apenas números. Usando 0 (todas as turmas).");
    return 0;
  }

  if (numero < 0 || numero > 100) {
    alert("O valor deve estar entre 0 e 100. Usando 0 (todas as turmas).");
    return 0;
  }

  return numero;
}

// ---------- 3. CLASSIFICAÇÃO (if / else if / else) ----------
// A ordem importa: do maior limite para o menor.
function classificarOcupacao(ocupacao) {
  let situacao;

  if (ocupacao >= 100) {
    situacao = "Lotada";
  } else if (ocupacao >= 80) {
    situacao = "Últimas vagas";
  } else {
    situacao = "Disponível";
  }

  return situacao;
}

// ---------- 4. SWITCH sobre a modalidade (texto) ----------
function salaDaModalidade(modalidade) {
  let sala;

  switch (modalidade) {
    case "musculacao":
      sala = "Salão de musculação";
      break;
    case "spinning":
      sala = "Sala de bikes";
      break;
    case "funcional":
    case "crossfit":
      sala = "Área funcional";
      break;
    case "yoga":
      sala = "Sala de práticas leves";
      break;
    default:
      sala = "Sala multiuso";
  }

  return sala;
}

// Remove acentos e maiúsculas para a busca não falhar por detalhe de digitação
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ---------- 5. PROCESSAMENTO PRINCIPAL ----------
const ocupacaoMinima = lerOcupacaoMinima();

let lotadas = 0;                 // contador
let vagasLivres = 0;             // acumulador
let maiorTurma = turmas[0];      // máximo (maior nº de inscritos)
const relatorio = [];

for (const turma of turmas) {
  const ocupacao = Math.round((turma.inscritos / turma.vagas) * 100);
  const situacao = classificarOcupacao(ocupacao);
  const sala = salaDaModalidade(turma.modalidade);

  if (situacao === "Lotada") {
    lotadas++;
  }

  vagasLivres += turma.vagas - turma.inscritos;

  if (turma.inscritos > maiorTurma.inscritos) {
    maiorTurma = turma;
  }

  if (ocupacao >= ocupacaoMinima) {
    relatorio.push({
      turma: turma.nome,
      ocupacao: `${ocupacao}%`,
      situacao: situacao,
      sala: sala
    });
  }

  console.log(`${turma.nome}: ${ocupacao}% (${situacao}) - ${sala}`);
}

// ---------- 6. SAÍDA ----------
console.log(`Turmas com ocupação a partir de ${ocupacaoMinima}%:`);
console.table(relatorio);

console.log(
  `Resumo: ${lotadas} turma(s) lotada(s), ${vagasLivres} vaga(s) livre(s) no total. ` +
  `Maior turma: ${maiorTurma.nome} com ${maiorTurma.inscritos} inscritos.`
);

// ---------- 7. WHILE com palavra de saída ----------
let comando = prompt('Digite o nome de uma turma para consultar (ou "sair"):');

while (comando !== null && comando.trim().toLowerCase() !== "sair") {
  const busca = normalizar(comando.trim());
  let encontrada = null;

  for (const turma of turmas) {
    if (normalizar(turma.nome).includes(busca) && busca !== "") {
      encontrada = turma;
      break;
    }
  }

  if (encontrada === null) {
    alert(`Nenhuma turma encontrada para "${comando}".`);
  } else {
    const livres = encontrada.vagas - encontrada.inscritos;
    alert(`${encontrada.nome}: ${livres} vaga(s) livre(s) de ${encontrada.vagas}.`);
  }

  // A condição é atualizada DENTRO do laço (evita loop infinito)
  comando = prompt('Digite o nome de uma turma para consultar (ou "sair"):');
}

console.log("Consulta encerrada.");