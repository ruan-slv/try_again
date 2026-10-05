/**
 * Exemplo de uso do Cypress Lite
 * Demonstra as principais funcionalidades do framework
 */

const { cy, expect, createElement, createDocument, runner } = require('../src/index');

// ============================================
// Exemplo 1: Testes de asserções básicas
// ============================================
describe('Asserções básicas', () => {
  it('deve verificar igualdade', () => {
    expect(1 + 1).to.equal(2);
    expect('hello').to.equal('hello');
  });

  it('deve verificar desigualdade com not', () => {
    expect(1 + 1).not.to.equal(3);
  });

  it('deve verificar tipos', () => {
    expect(42).to.be.a('number');
    expect('text').to.be.a('string');
    expect(true).to.be.a('boolean');
  });

  it('deve verificar arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).to.have.length(3);
    expect(arr).to.include(2);
  });

  it('deve verificar objetos', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj).to.have.property('name', 'Test');
    expect(obj).to.have.property('value');
  });

  it('deve verificar valores booleanos', () => {
    expect(true).to.be.true();
    expect(false).to.be.false();
    expect(null).to.be.null();
    expect(undefined).to.be.undefined();
  });

  it('deve verificar existência', () => {
    expect(0).to.exist();
    expect('').to.exist();
    expect(null).not.to.exist();
  });

  it('deve verificar arrays vazios', () => {
    expect([]).to.be.empty();
    expect('').to.be.empty();
    expect([1, 2]).not.to.be.empty();
  });

  it('deve verificar intervalos', () => {
    expect(5).to.be.above(3);
    expect(5).to.be.below(10);
    expect(5).to.be.at.least(5);
    expect(5).to.be.at.most(5);
  });

  it('deve verificar regex', () => {
    expect('hello world').to.match(/world/);
    expect('test123').to.match(/^\w+\d+$/);
  });

  it('deve verificar erros', () => {
    expect(() => { throw new Error('fail'); }).to.throw(Error);
    expect(() => {}).to.not.throw();
  });
});

// ============================================
// Exemplo 2: Testes com DOM simulado
// ============================================
describe('DOM simulado', () => {
  let document;

  beforeEach(() => {
    document = createDocument();
  });

  it('deve criar elementos', () => {
    const div = createElement('div', { id: 'test', class: 'container' });
    expect(div.tagName).to.equal('div');
    expect(div.id).to.equal('test');
    expect(div.hasClass('container')).to.be.true();
  });

  it('deve manipular classes', () => {
    const el = createElement('div');
    el.addClass('active');
    expect(el.hasClass('active')).to.be.true();
    el.removeClass('active');
    expect(el.hasClass('active')).to.be.false();
  });

  it('deve manipular atributos', () => {
    const el = createElement('input');
    el.setAttribute('type', 'text');
    el.setAttribute('placeholder', 'Digite aqui');
    expect(el.getAttribute('type')).to.equal('text');
    expect(el.getAttribute('placeholder')).to.equal('Digite aqui');
  });

  it('deve manipular filhos', () => {
    const parent = createElement('div');
    const child1 = createElement('span', {}, 'Texto 1');
    const child2 = createElement('span', {}, 'Texto 2');

    parent.appendChild(child1);
    parent.appendChild(child2);

    expect(parent.children).to.have.length(2);
    expect(parent.children[0].textContent).to.equal('Texto 1');
  });

  it('deve buscar elementos por seletor', () => {
    const div = createElement('div', { id: 'container' });
    const span = createElement('span', { class: 'highlight' }, 'Hello');
    div.appendChild(span);
    document.body.appendChild(div);

    const found = document.querySelector('#container span.highlight');
    expect(found).to.exist();
    expect(found.textContent).to.equal('Hello');
  });

  it('deve simular eventos', () => {
    const button = createElement('button', { id: 'btn' });
    let clicked = false;
    button.addEventListener('click', () => { clicked = true; });
    button.click();
    expect(clicked).to.be.true();
  });

  it('deve manipular valor de input', () => {
    const input = createElement('input', { type: 'text' });
    input.value = 'teste';
    expect(input.value).to.equal('teste');
    input.clear();
    expect(input.value).to.equal('');
  });
});

// ============================================
// Exemplo 3: Testes assíncronos
// ============================================
describe('Testes assíncronos', () => {
  it('deve esperar promise', async () => {
    const result = await new Promise(resolve => {
      setTimeout(() => resolve(42), 10);
    });
    expect(result).to.equal(42);
  });

  it('deve usar cy.wait', async () => {
    await cy.wait(50);
    expect(true).to.be.true();
  });
});

// ============================================
// Exemplo 4: Hooks
// ============================================
describe('Hooks', () => {
  let counter;

  before(() => {
    counter = 0;
  });

  after(() => {
    counter = null;
  });

  beforeEach(() => {
    counter++;
  });

  afterEach(() => {
    // Cleanup após cada teste
  });

  it('deve ter counter = 1 no primeiro teste', () => {
    expect(counter).to.equal(1);
  });

  it('deve ter counter = 2 no segundo teste', () => {
    expect(counter).to.equal(2);
  });
});

// ============================================
// Exemplo 5: Sub-suítes
// ============================================
describe('Suíte principal', () => {
  describe('Sub-suíte A', () => {
    it('deve executar teste A1', () => {
      expect(true).to.be.true();
    });

    it('deve executar teste A2', () => {
      expect(1).to.equal(1);
    });
  });

  describe('Sub-suíte B', () => {
    it('deve executar teste B1', () => {
      expect('a').to.equal('a');
    });
  });
});

// ============================================
// Exemplo 6: API estilo Cypress
// ============================================
describe('API estilo Cypress', () => {
  it('deve usar cy.get e cy.click', () => {
    const document = createDocument();
    const button = createElement('button', { id: 'submit' }, 'Enviar');
    document.body.appendChild(button);

    // Simula cy.get('#submit').click()
    const el = document.querySelector('#submit');
    el.click();
    expect(el.textContent).to.equal('Enviar');
  });

  it('deve usar cy.contains', () => {
    const document = createDocument();
    const div = createElement('div', {}, 'Bem-vindo ao Cypress Lite');
    document.body.appendChild(div);

    const all = document.querySelectorAll('*');
    const found = all.find(el => el.textContent.includes('Cypress Lite'));
    expect(found).to.exist();
  });
});

// Executa os testes
runner.run();
