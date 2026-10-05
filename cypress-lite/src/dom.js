/**
 * Simulador de DOM - Cypress Lite
 * Fornece uma implementação leve de DOM para testes sem navegador
 */

class LiteElement {
  constructor(tagName, attributes = {}, children = []) {
    this.tagName = tagName.toLowerCase();
    this.attributes = { ...attributes };
    this.children = [...children];
    this.textContent = '';
    this.parent = null;
    this.eventListeners = {};
    this.styles = {};
    this.classes = new Set();
    this._value = '';
    this._checked = false;
    this._visible = true;

    // Processa classes do atributo class
    if (this.attributes.class) {
      this.attributes.class.split(/\s+/).forEach(c => this.classes.add(c));
    }
  }

  get id() {
    return this.attributes.id || '';
  }

  get className() {
    return Array.from(this.classes).join(' ');
  }

  set className(value) {
    this.classes = new Set(value.split(/\s+/).filter(Boolean));
    this.attributes.class = value;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = String(val);
  }

  get checked() {
    return this._checked;
  }

  set checked(val) {
    this._checked = Boolean(val);
  }

  get visible() {
    return this._visible;
  }

  set visible(val) {
    this._visible = Boolean(val);
  }

  get innerHTML() {
    return this.children.map(c => {
      if (c instanceof LiteElement) return c.outerHTML;
      return String(c);
    }).join('');
  }

  set innerHTML(html) {
    this.children = [];
    // Simplificação: não parseia HTML complexo
    if (html) {
      this.children.push(html);
    }
  }

  get textContent() {
    return this.children.map(c => {
      if (c instanceof LiteElement) return c.textContent;
      return String(c);
    }).join('');
  }

  set textContent(text) {
    this.children = [String(text)];
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
    const open = `<${this.tagName}${attrs ? ' ' + attrs : ''}>`;
    const close = `</${this.tagName}>`;
    return `${open}${this.innerHTML}${close}`;
  }

  appendChild(child) {
    if (child instanceof LiteElement) {
      child.parent = this;
    }
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
    return child;
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      const idx = this.eventListeners[event].indexOf(handler);
      if (idx !== -1) {
        this.eventListeners[event].splice(idx, 1);
      }
    }
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners[event.type] || [];
    handlers.forEach(h => h({ type: event.type, target: this, preventDefault: () => {}, stopPropagation: () => {} }));
    return true;
  }

  click() {
    this.dispatchEvent({ type: 'click' });
  }

  focus() {
    this.dispatchEvent({ type: 'focus' });
  }

  blur() {
    this.dispatchEvent({ type: 'blur' });
  }

  type(text) {
    this.value += text;
    this.dispatchEvent({ type: 'input' });
  }

  clear() {
    this.value = '';
    this.dispatchEvent({ type: 'input' });
  }

  setText(text) {
    this.textContent = String(text);
    this.children = [this.textContent];
  }

  addClass(className) {
    className.split(/\s+/).forEach(c => this.classes.add(c));
    this.attributes.class = this.className;
  }

  removeClass(className) {
    className.split(/\s+/).forEach(c => this.classes.delete(c));
    this.attributes.class = this.className;
  }

  hasClass(className) {
    return this.classes.has(className);
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') {
      this.classes = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  querySelector(selector) {
    return querySelectorAll(this, selector)[0] || null;
  }

  querySelectorAll(selector) {
    return querySelectorAll(this, selector);
  }

  getElementsByTagName(tagName) {
    return querySelectorAll(this, tagName);
  }

  getElementsByClassName(className) {
    return querySelectorAll(this, `.${className}`);
  }
}

/**
 * Seletor CSS simplificado
 */
function querySelectorAll(root, selector) {
  const results = [];
  const parts = selector.trim().split(/\s+/);

  function search(element, partIndex) {
    if (partIndex >= parts.length) {
      results.push(element);
      return;
    }

    const part = parts[partIndex];
    const matches = findMatches(element, part);

    for (const match of matches) {
      search(match, partIndex + 1);
    }
  }

  function findMatches(element, selector) {
    const matches = [];

    for (const child of element.children) {
      if (!(child instanceof LiteElement)) continue;

      if (matchesSelector(child, selector)) {
        matches.push(child);
      }

      // Busca recursiva
      matches.push(...findMatches(child, selector));
    }

    return matches;
  }

  search(root, 0);
  return results;
}

/**
 * Verifica se um elemento corresponde a um seletor
 */
function matchesSelector(element, selector) {
  // Seletor de tag
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(selector)) {
    return element.tagName === selector.toLowerCase();
  }

  // Seletor de ID
  if (selector.startsWith('#')) {
    return element.id === selector.slice(1);
  }

  // Seletor de classe
  if (selector.startsWith('.')) {
    return element.hasClass(selector.slice(1));
  }

  // Seletor de atributo
  if (selector.startsWith('[')) {
    const match = selector.match(/^\[([^\]]+)\]$/);
    if (match) {
      const attr = match[1];
      const hasValue = attr.includes('=');
      if (hasValue) {
        const [name, value] = attr.split('=').map(s => s.trim().replace(/"/g, ''));
        return element.getAttribute(name) === value;
      }
      return element.getAttribute(attr) !== null;
    }
  }

  // Seletor composto (ex: div.class#id)
  const tagMatch = selector.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
  const classMatches = selector.match(/\.([a-zA-Z][a-zA-Z0-9-]*)/g) || [];
  const idMatch = selector.match(/#([a-zA-Z][a-zA-Z0-9-]*)/);

  if (tagMatch && element.tagName !== tagMatch[1].toLowerCase()) return false;
  if (idMatch && element.id !== idMatch[1]) return false;
  for (const cls of classMatches) {
    if (!element.hasClass(cls.slice(1))) return false;
  }

  return true;
}

/**
 * Cria um elemento DOM simulado
 */
function createElement(tagName, attributes, ...children) {
  return new LiteElement(tagName, attributes, children);
}

/**
 * Cria um documento simulado
 */
function createDocument() {
  const document = {
    body: new LiteElement('body'),
    head: new LiteElement('head'),
    documentElement: new LiteElement('html'),
    _elements: new Map(),
    _idCounter: 0,

    createElement(tagName) {
      return new LiteElement(tagName);
    },

    createTextNode(text) {
      return { textContent: String(text), nodeType: 3 };
    },

    getElementById(id) {
      return this._elements.get(id) || null;
    },

    querySelector(selector) {
      return this.body.querySelector(selector);
    },

    querySelectorAll(selector) {
      return this.body.querySelectorAll(selector);
    },

    getElementsByTagName(tagName) {
      return this.body.getElementsByTagName(tagName);
    },

    getElementsByClassName(className) {
      return this.body.getElementsByClassName(className);
    },

    registerElement(element) {
      if (element.id) {
        this._elements.set(element.id, element);
      }
      return element;
    },

    addEventListener(event, handler) {
      this.body.addEventListener(event, handler);
    },

    removeEventListener(event, handler) {
      this.body.removeEventListener(event, handler);
    }
  };

  document.documentElement.appendChild(document.head);
  document.documentElement.appendChild(document.body);

  return document;
}

module.exports = {
  LiteElement,
  createElement,
  createDocument,
  querySelectorAll,
  matchesSelector
};
