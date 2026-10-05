/**
 * Cypress Lite - Framework de testes E2E sem dependências
 * API pública principal
 */

const { Assert, AssertionError } = require('./assert');
const { TestRunner, runner } = require('./runner');
const { LiteElement, createElement, createDocument } = require('./dom');

/**
 * API estilo Cypress para interação com elementos
 */
class Cy {
  constructor() {
    this._subject = null;
    this._document = null;
  }

  /**
   * Visita uma URL (simulado)
   */
  visit(url) {
    console.log(`   🌐 Visitando: ${url}`);
    this._document = createDocument();
    return this;
  }

  /**
   * Obtém elemento por seletor
   */
  get(selector) {
    if (!this._document) {
      throw new Error('Documento não inicializado. Use cy.visit() primeiro.');
    }
    const element = this._document.querySelector(selector);
    if (!element) {
      throw new Error(`Elemento não encontrado: ${selector}`);
    }
    this._subject = element;
    return this;
  }

  /**
   * Obtém elemento por texto
   */
  contains(text) {
    if (!this._document) {
      throw new Error('Documento não inicializado. Use cy.visit() primeiro.');
    }
    const all = this._document.querySelectorAll('*');
    const element = all.find(el => el.textContent && el.textContent.includes(text));
    if (!element) {
      throw new Error(`Elemento com texto "${text}" não encontrado`);
    }
    this._subject = element;
    return this;
  }

  /**
   * Clica no elemento atual
   */
  click() {
    this._ensureSubject();
    this._subject.click();
    return this;
  }

  /**
   * Digita texto no elemento atual
   */
  type(text) {
    this._ensureSubject();
    this._subject.type(text);
    return this;
  }

  /**
   * Limpa o valor do elemento atual
   */
  clear() {
    this._ensureSubject();
    this._subject.value = '';
    return this;
  }

  /**
   * Verifica se o elemento está visível
   */
  shouldVisible() {
    this._ensureSubject();
    if (!this._subject.visible) {
      throw new Error(`Elemento não está visível`);
    }
    return this;
  }

  /**
   * Verifica se o elemento contém texto
   */
  shouldContain(text) {
    this._ensureSubject();
    if (!this._subject.textContent || !this._subject.textContent.includes(text)) {
      throw new Error(`Elemento não contém o texto "${text}"`);
    }
    return this;
  }

  /**
   * Verifica se o elemento tem a classe
   */
  shouldHaveClass(className) {
    this._ensureSubject();
    if (!this._subject.hasClass(className)) {
      throw new Error(`Elemento não tem a classe "${className}"`);
    }
    return this;
  }

  /**
   * Verifica se o elemento tem o atributo
   */
  shouldHaveAttr(name, value) {
    this._ensureSubject();
    const attrValue = this._subject.getAttribute(name);
    if (attrValue === null) {
      throw new Error(`Elemento não tem o atributo "${name}"`);
    }
    if (value !== undefined && attrValue !== value) {
      throw new Error(`Atributo "${name}" = "${attrValue}", esperado "${value}"`);
    }
    return this;
  }

  /**
   * Verifica o valor do elemento
   */
  shouldHaveValue(value) {
    this._ensureSubject();
    if (this._subject.value !== value) {
      throw new Error(`Valor = "${this._subject.value}", esperado "${value}"`);
    }
    return this;
  }

  /**
   * Verifica se o elemento está marcado (checkbox/radio)
   */
  shouldChecked() {
    this._ensureSubject();
    if (!this._subject.checked) {
      throw new Error(`Elemento não está marcado`);
    }
    return this;
  }

  /**
   * Verifica se o elemento NÃO está marcado
   */
  shouldNotBeChecked() {
    this._ensureSubject();
    if (this._subject.checked) {
      throw new Error(`Elemento está marcado`);
    }
    return this;
  }

  /**
   * Espera um tempo (simulado)
   */
  wait(ms) {
    console.log(`   ⏳ Aguardando ${ms}ms...`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retorna o elemento atual
   */
  then(callback) {
    this._ensureSubject();
    const result = callback(this._subject);
    return result !== undefined ? result : this;
  }

  _ensureSubject() {
    if (!this._subject) {
      throw new Error('Nenhum elemento selecionado. Use cy.get() ou cy.contains() primeiro.');
    }
  }
}

// Instância global do Cy
const cy = new Cy();

// Exportações
module.exports = {
  // API principal
  cy,
  Cy,

  // Asserções
  expect: (actual) => Assert.expect(actual),
  Assert,
  AssertionError,

  // Runner
  describe,
  it,
  before,
  after,
  beforeEach,
  afterEach,
  runner,
  TestRunner,

  // DOM
  createElement,
  createDocument,
  LiteElement,
  querySelectorAll,

  // Utilitários
  version: '1.0.0'
};
