const { operation } = require('./index');

describe('Testes do módulo de contas', () => {
    it('deve chamar a função operation corretamente', () => {
        // Mock da função console.log para evitar logs durante o teste
        console.log = jest.fn();

        // Chamar a função diretamente
        operation();

        // Restaure a função original após o teste
        console.log.mockRestore();
    });
});