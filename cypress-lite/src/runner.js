/**
 * Runner de testes - Cypress Lite
 * Gerencia a execução de suítes e testes
 */

const { Assert } = require('./assert');

class TestRunner {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: [],
      startTime: null,
      endTime: null
    };
    this.hooks = {
      before: [],
      after: [],
      beforeEach: [],
      afterEach: []
    };
  }

  /**
   * Define uma suíte de testes
   */
  describe(name, fn) {
    const parentSuite = this.currentSuite;
    const suite = {
      name,
      tests: [],
      suites: [],
      parent: parentSuite,
      hooks: {
        before: [],
        after: [],
        beforeEach: [],
        afterEach: []
      }
    };

    if (parentSuite) {
      parentSuite.suites.push(suite);
    } else {
      this.suites.push(suite);
    }

    this.currentSuite = suite;
    fn();
    this.currentSuite = parentSuite;
  }

  /**
   * Define um teste
   */
  it(name, fn) {
    if (!this.currentSuite) {
      throw new Error('Teste deve estar dentro de uma suíte (describe)');
    }
    this.currentSuite.tests.push({ name, fn });
  }

  /**
   * Hook executado antes de todos os testes da suíte
   */
  before(fn) {
    if (this.currentSuite) {
      this.currentSuite.hooks.before.push(fn);
    } else {
      this.hooks.before.push(fn);
    }
  }

  /**
   * Hook executado após todos os testes da suíte
   */
  after(fn) {
    if (this.currentSuite) {
      this.currentSuite.hooks.after.push(fn);
    } else {
      this.hooks.after.push(fn);
    }
  }

  /**
   * Hook executado antes de cada teste
   */
  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.hooks.beforeEach.push(fn);
    } else {
      this.hooks.beforeEach.push(fn);
    }
  }

  /**
   * Hook executado após cada teste
   */
  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.hooks.afterEach.push(fn);
    } else {
      this.hooks.afterEach.push(fn);
    }
  }

  /**
   * Executa todos os testes
   */
  async run() {
    this.results.startTime = Date.now();
    console.log('\n🧪 Cypress Lite - Executando testes\n');
    console.log('═'.repeat(60));

    for (const suite of this.suites) {
      await this._runSuite(suite, '');
    }

    this.results.endTime = Date.now();
    this._printSummary();

    return this.results;
  }

  /**
   * Executa uma suíte de testes
   */
  async _runSuite(suite, indent) {
    const prefix = indent ? `${indent}  ` : '';
    console.log(`\n${prefix}📁 ${suite.name}`);

    // Define a suíte atual para os hooks
    const previousSuite = this.currentSuite;
    this.currentSuite = suite;

    // Executa hooks before
    for (const hook of suite.hooks.before) {
      await this._executeHook(hook, `${prefix}  [before]`);
    }

    // Executa testes
    for (const test of suite.tests) {
      await this._runTest(test, prefix + '  ');
    }

    // Executa sub-suítes
    for (const subSuite of suite.suites) {
      await this._runSuite(subSuite, prefix + '  ');
    }

    // Executa hooks after
    for (const hook of suite.hooks.after) {
      await this._executeHook(hook, `${prefix}  [after]`);
    }

    // Restaura a suíte anterior
    this.currentSuite = previousSuite;
  }

  /**
   * Executa um teste individual
   */
  async _runTest(test, indent) {
    this.results.total++;
    const startTime = Date.now();

    try {
      // Hooks beforeEach
      for (const hook of this.hooks.beforeEach) {
        await hook();
      }
      if (this.currentSuite) {
        for (const hook of this.currentSuite.hooks.beforeEach) {
          await hook();
        }
      }

      // Executa o teste
      await test.fn();

      // Hooks afterEach
      if (this.currentSuite) {
        for (const hook of this.currentSuite.hooks.afterEach) {
          await hook();
        }
      }
      for (const hook of this.hooks.afterEach) {
        await hook();
      }

      const duration = Date.now() - startTime;
      this.results.passed++;
      this.results.tests.push({
        name: test.name,
        status: 'passed',
        duration
      });

      console.log(`${indent}✅ ${test.name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.failed++;
      this.results.tests.push({
        name: test.name,
        status: 'failed',
        duration,
        error: error.message
      });

      console.log(`${indent}❌ ${test.name} (${duration}ms)`);
      console.log(`${indent}   💥 ${error.message}`);
    }
  }

  /**
   * Executa um hook
   */
  async _executeHook(hook, indent) {
    try {
      await hook();
    } catch (error) {
      console.log(`${indent}⚠️  Hook falhou: ${error.message}`);
    }
  }

  /**
   * Imprime resumo dos resultados
   */
  _printSummary() {
    const duration = this.results.endTime - this.results.startTime;
    const { passed, failed, total } = this.results;

    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 Resumo dos Testes\n');
    console.log(`   Total:  ${total}`);
    console.log(`   ✅ Passaram: ${passed}`);
    console.log(`   ❌ Falharam: ${failed}`);
    console.log(`   ⏱️  Duração: ${duration}ms`);

    if (failed > 0) {
      console.log('\n❌ Testes que falharam:');
      const failedTests = this.results.tests.filter(t => t.status === 'failed');
      failedTests.forEach(t => {
        console.log(`   - ${t.name}`);
        console.log(`     ${t.error}`);
      });
    }

    console.log('\n' + '═'.repeat(60) + '\n');

    // Exit code para CI/CD
    if (failed > 0) {
      process.exitCode = 1;
    }
  }
}

// Singleton global
const runner = new TestRunner();

// Funções globais estilo Cypress/Mocha
global.describe = (name, fn) => runner.describe(name, fn);
global.it = (name, fn) => runner.it(name, fn);
global.before = (fn) => runner.before(fn);
global.after = (fn) => runner.after(fn);
global.beforeEach = (fn) => runner.beforeEach(fn);
global.afterEach = (fn) => runner.afterEach(fn);
global.expect = (actual) => Assert.expect(actual);

module.exports = { TestRunner, runner };
