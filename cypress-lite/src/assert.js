/**
 * Módulo de asserções - Cypress Lite
 * Fornece métodos de verificação estilo Chai/Mocha
 */

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

class Assert {
  constructor() {
    this.negate = false;
  }

  /**
   * Cria uma nova instância de asserção encadeável
   */
  static expect(actual) {
    const assert = new Assert();
    return assert._chain(actual);
  }

  /**
   * Cria a cadeia de métodos encadeáveis
   */
  _chain(actual) {
    const self = this;
    const chain = {
      get not() {
        self.negate = !self.negate;
        return chain;
      },
      get to() { return chain; },
      get be() { return chain; },
      get been() { return chain; },
      get is() { return chain; },
      get that() { return chain; },
      get and() { return chain; },
      get have() { return chain; },
      get has() { return chain; },
      get with() { return chain; },
      get at() { return chain; },
      get of() { return chain; },
      get same() { return chain; },
      get but() { return chain; },
      get does() { return chain; },
      get still() { return chain; },

      /**
       * Verifica igualdade estrita
       */
      equal(expected) {
        const pass = actual === expected;
        self._check(pass, `esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica igualdade profunda
       */
      eql(expected) {
        const pass = self._deepEqual(actual, expected);
        self._check(pass, `esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se é verdadeiro
       */
      true() {
        self._check(actual === true, `esperado true, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se é falso
       */
      false() {
        self._check(actual === false, `esperado false, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se é nulo
       */
      null() {
        self._check(actual === null, `esperado null, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se é indefinido
       */
      undefined() {
        self._check(actual === undefined, `esperado undefined, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se existe (não nulo e não indefinido)
       */
      exist() {
        self._check(actual !== null && actual !== undefined, `esperado valor existente, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se está vazio
       */
      empty() {
        let isEmpty = false;
        if (actual === null || actual === undefined) isEmpty = true;
        else if (typeof actual === 'string' || Array.isArray(actual)) isEmpty = actual.length === 0;
        else if (typeof actual === 'object') isEmpty = Object.keys(actual).length === 0;
        self._check(isEmpty, `esperado valor vazio, recebido ${JSON.stringify(actual)}`);
        return chain;
      },

      /**
       * Verifica se contém valor
       */
      include(expected) {
        let pass = false;
        if (typeof actual === 'string') pass = actual.includes(expected);
        else if (Array.isArray(actual)) pass = actual.includes(expected);
        else if (typeof actual === 'object' && actual !== null) pass = expected in actual;
        self._check(pass, `esperado que ${JSON.stringify(actual)} contenha ${JSON.stringify(expected)}`);
        return chain;
      },

      /**
       * Verifica se contém chave
       */
      contain(expected) {
        return chain.include(expected);
      },

      /**
       * Verifica comprimento
       */
      length(expected) {
        const len = actual ? actual.length : 0;
        self._check(len === expected, `esperado comprimento ${expected}, recebido ${len}`);
        return chain;
      },

      /**
       * Verifica se é maior que
       */
      above(expected) {
        self._check(actual > expected, `esperado ${actual} > ${expected}`);
        return chain;
      },

      /**
       * Verifica se é maior ou igual
       */
      least(expected) {
        self._check(actual >= expected, `esperado ${actual} >= ${expected}`);
        return chain;
      },

      /**
       * Verifica se é menor que
       */
      below(expected) {
        self._check(actual < expected, `esperado ${actual} < ${expected}`);
        return chain;
      },

      /**
       * Verifica se é menor ou igual
       */
      most(expected) {
        self._check(actual <= expected, `esperado ${actual} <= ${expected}`);
        return chain;
      },

      /**
       * Verifica se corresponde a regex
       */
      match(regex) {
        const pass = regex.test(actual);
        self._check(pass, `esperado que ${JSON.stringify(actual)} corresponda a ${regex}`);
        return chain;
      },

      /**
       * Verifica tipo
       */
      a(type) {
        const actualType = typeof actual;
        const pass = actualType === type;
        self._check(pass, `esperado tipo ${type}, recebido ${actualType}`);
        return chain;
      },

      /**
       * Verifica se é instância de
       */
      instanceof(Class) {
        const pass = actual instanceof Class;
        self._check(pass, `esperado instância de ${Class.name}`);
        return chain;
      },

      /**
       * Verifica se lança erro
       */
      throw(ErrorClass) {
        let threw = false;
        let thrownError = null;
        try {
          actual();
        } catch (e) {
          threw = true;
          thrownError = e;
        }
        self._check(threw, 'esperado que lançasse erro');
        if (ErrorClass && threw) {
          self._check(thrownError instanceof ErrorClass, `esperado erro do tipo ${ErrorClass.name}`);
        }
        return chain;
      },

      /**
       * Verifica propriedade
       */
      property(key, value) {
        const has = actual && typeof actual === 'object' && key in actual;
        self._check(has, `esperado propriedade '${key}'`);
        if (value !== undefined && has) {
          self._check(actual[key] === value, `esperado propriedade '${key}' = ${JSON.stringify(value)}, recebido ${JSON.stringify(actual[key])}`);
        }
        return chain;
      },

      /**
       * Verifica se função não lança erro
       */
      nothrow() {
        let threw = false;
        try {
          actual();
        } catch (e) {
          threw = true;
        }
        self._check(!threw, 'esperado que não lançasse erro');
        return chain;
      }
    };

    return chain;
  }

  /**
   * Verifica a condição e lança erro se necessário
   */
  _check(pass, message) {
    if (this.negate) {
      if (pass) {
        throw new AssertionError(`esperado que NÃO ${message}`);
      }
    } else {
      if (!pass) {
        throw new AssertionError(message);
      }
    }
    this.negate = false;
  }

  /**
   * Comparação profunda de objetos
   */
  _deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return false;

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this._deepEqual(a[key], b[key])) return false;
    }

    return true;
  }
}

module.exports = { Assert, AssertionError };
