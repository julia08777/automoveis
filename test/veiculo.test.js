import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { MontadoraFactory } from './factories/MontadoraFactory.js';
import { ClienteFactory } from './factories/ClienteFactory.js';
import { VeiculoFactory } from './factories/VeiculoFactory.js';

describe('Testes de Integração - Veículos', () => {

  it('CT-008 - Deve criar veículo vinculado a montadora e cliente válidos', async () => {
    const montadora = await MontadoraFactory.create('Toyota', 'Japão');
    const cliente = await ClienteFactory.create(
      'Maria', '11122233344', '01001000', 'Rua B', 'Centro', 'SP', 'SP', '10', ''
    );

    const response = await request(app)
      .post('/veiculos')
      .send({
        idMontadora: montadora.id,
        idCliente: cliente.id,
        modelo: 'Corolla',
        placa: 'ABC1D23',
        ano: 2023,
        cor: 'Preto',
        valor: 140000
      });

    expect(response.status).toBe(201);
  });

  it('CT-009 - Deve atualizar informações de veículo existente', async () => {
    const montadora = await MontadoraFactory.create('Honda', 'Japão');
    const cliente = await ClienteFactory.create('Pedro', '99988877766', '01001000', 'Rua D', 'Centro', 'SP', 'SP', '5', '');
    const veiculo = await VeiculoFactory.create('Civic', 'XYZ1234', 2021, 'Preto', 100000, cliente.id, montadora.id);

    const response = await request(app)
      .put(`/veiculos?id=${veiculo.id}`)
      .send({ cor: 'Branco' });

    expect(response.status).toBe(200);
  });

  it('CT-010 - Deve listar todos os veículos cadastrados', async () => {
    const response = await request(app).get('/veiculos');

    expect(response.status).toBe(200);
  });

  it('CT-020 - Deve buscar veículo específico por ID', async () => {
    const montadora = await MontadoraFactory.create('Fiat', 'Itália');
    const cliente = await ClienteFactory.create('Lucas', '77766655544', '01001000', 'Rua E', 'Centro', 'SP', 'SP', '2', '');
    const veiculo = await VeiculoFactory.create('Uno', 'UNO1234', 2015, 'Vermelho', 30000, cliente.id, montadora.id);

    const response = await request(app).get(`/veiculos/${veiculo.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-021 - Deve falhar ao vincular idMontadora inexistente', async () => {
    const cliente = await ClienteFactory.create(
      'Ana', '55566677788', '01001000', 'Rua C', 'Centro', 'SP', 'SP', '20', ''
    );

    const response = await request(app)
      .post('/veiculos')
      .send({
        idMontadora: 9999,
        idCliente: cliente.id,
        modelo: 'Civic',
        placa: 'XYZ9K88',
        ano: 2022,
        cor: 'Cinza',
        valor: 120000
      });

    expect([400, 404]).toContain(response.status);
  });

  it('CT-022 - Deve falhar ao vincular idCliente inexistente', async () => {
    const montadora = await MontadoraFactory.create('Ford', 'EUA');

    const response = await request(app)
      .post('/veiculos')
      .send({
        idMontadora: montadora.id,
        idCliente: 9999,
        modelo: 'Ka',
        placa: 'KAA1234',
        ano: 2020,
        cor: 'Prata',
        valor: 45000
      });

    expect([400, 404]).toContain(response.status);
  });

  it('CT-023 - Deve deletar veículo por ID com sucesso', async () => {
    const montadora = await MontadoraFactory.create('Renault', 'França');
    const cliente = await ClienteFactory.create('Gabi', '33322211100', '01001000', 'Rua F', 'Centro', 'SP', 'SP', '8', '');
    const veiculo = await VeiculoFactory.create('Kwid', 'KWD9876', 2022, 'Branco', 50000, cliente.id, montadora.id);

    const response = await request(app).delete(`/veiculos/${veiculo.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-024 - Deve retornar 404 ao tentar deletar veículo com ID inexistente', async () => {
    const response = await request(app).delete('/veiculos/9999');

    expect(response.status).toBe(404);
  });

});