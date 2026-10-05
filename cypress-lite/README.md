# 🧪 Cypress Lite

Framework de testes E2E leve, **sem dependências externas**, inspirado no Cypress. Ideal para ambientes restritos onde não é possível instalar pacotes npm.

## ✨ Características

- ✅ **Zero dependências** - Apenas JavaScript puro
- ✅ **API estilo Cypress** - Familiar para quem já usa Cypress
- ✅ **Asserções encadeáveis** - Estilo Chai/Mocha
- ✅ **DOM simulado** - Testes sem navegador
- ✅ **Hooks** - before, after, beforeEach, afterEach
- ✅ **Testes assíncronos** - Suporte a async/await
- ✅ **Sub-suítes** - Organização hierárquica
- ✅ **Relatório detalhado** - Resumo de execução

## 🚀 Instalação

```bash
# Copie a pasta cypress-lite para seu projeto
cp -r cypress-lite /seu/projeto/

# Ou use como submodule
git submodule add <repo> cypress-lite
```

## 📖 Uso Rápido

```javascript
const { describe, it, expect, cy } = require('./cypress-lite/src/index');

describe('Minha suíte de testes', () => {
  it('deve fazer algo', () => {
    expect(1 + 1).to.equal(2);
  });

  it('deve testar DOM', () => {
    cy.visit('http://localhost:3000');
    cy.get('#botao').click();
    cy.get('.resultado').shouldContain('Sucesso');
  });
});
```

## 📚 API

### Asserções (expect)

```javascript
expect(valor).to.equal(outro);
expect(valor).not.to.equal(outro);
expect(valor).to.be.true();
expect(valor).to.be.false();
expect(valor).to.be.null();
expect(valor).to.be.undefined();
expect(valor).to.exist();
expect(valor).to.be.empty();
expect(array).to.have.length(3);
expect(array).to.include(item);
expect(obj).to.have.property('chave', 'valor');
expect(valor).to.be.above(5);
expect(valor).to.be.below(10);
expect(valor).to.be.at.least(5);
expect(valor).to.be.at.most(10);
expect(string).to.match(/regex/);
expect(valor).to.be.a('number');
expect(fn).to.throw(Error);
```

### API Cypress (cy)

```javascript
cy.visit(url);                    // Visita uma URL (simulado)
cy.get(selector);                // Seleciona elemento
cy.contains(texto);              // Seleciona por texto
cy.click();                      // Clica no elemento atual
cy.type(texto);                  // Digita texto
cy.clear();                      // Limpa campo
cy.shouldVisible();              // Verifica visibilidade
cy.shouldContain(texto);         // Verifica texto
cy.shouldHaveClass(classe);      // Verifica classe
cy.shouldHaveAttr(nome, valor);  // Verifica atributo
cy.shouldHaveValue(valor);       // Verifica valor
cy.shouldChecked();              // Verifica checkbox marcado
cy.shouldNotBeChecked();         // Verifica checkbox desmarcado
cy.wait(ms);                     // Aguarda tempo
cy.then(callback);               // Callback com elemento
```

### Estrutura de Testes

```javascript
describe('Nome da suíte', () => {
  before(() => { /* executa antes de todos */ });
  after(() => { /* executa após todos */ });
  beforeEach(() => { /* executa antes de cada teste */ });
  afterEach(() => { /* executa após cada teste */ });

  it('descrição do teste', () => {
    // código do teste
  });

  describe('Sub-suíte', () => {
    it('teste da sub-suíte', () => {
      // código
    });
  });
});
```

### DOM Simulado

```javascript
const { createElement, createDocument } = require('./cypress-lite/src/index');

// Criar documento
const document = createDocument();

// Criar elementos
const div = createElement('div', { id: 'container', class: 'box' });
const span = createElement('span', { class: 'highlight' }, 'Texto');

// Manipular
div.appendChild(span);
div.addClass('active');
div.setAttribute('data-test', 'valor');
div.click();

// Buscar
const el = document.querySelector('#container');
const els = document.querySelectorAll('.box');
```

## 🧪 Executando os Testes

```bash
# Executar todos os testes
node tests/example.test.js

# Ou via npm
npm test
```

## 📊 Saída dos Testes

```
🧪 Cypress Lite - Executando testes

════════════════════════════════════════════════════════════

📁 Asserções básicas
  ✅ deve verificar igualdade (2ms)
  ✅ deve verificar desigualdade com not (1ms)
  ✅ deve verificar tipos (1ms)
  ...

════════════════════════════════════════════════════════════

📊 Resumo dos Testes

   Total:  25
   ✅ Passaram: 25
   ❌ Falharam: 0
   ⏱️  Duração: 150ms

════════════════════════════════════════════════════════════
```

## 📁 Estrutura do Projeto

```
cypress-lite/
├── src/
│   ├── index.js      # API pública principal
│   ├── runner.js     # Runner de testes
│   ├── assert.js     # Sistema de asserções
│   └── dom.js        # Simulador de DOM
├── tests/
│   └── example.test.js  # Exemplos de uso
├── package.json
└── README.md
```

## 🔧 Personalização

### Adicionando novas asserções

```javascript
// Em src/assert.js
_novaAsserção(parametro) {
  const pass = /* lógica */;
  this._check(pass, `mensagem de erro`);
  return chain;
}
```

### Adicionando novos comandos cy

```javascript
// Em src/index.js
_novoComando() {
  this._ensureSubject();
  // lógica
  return this;
}
```

## 📄 Licença

MIT
