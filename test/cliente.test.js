import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { ClienteFactory } from './factories/ClienteFactory.js';

describe('Testes de Integração - Clientes', () => {

  it('CT-005 - Deve criar cliente limpando CPF e buscando CEP', async () => {
    const response = await request(app)
      .post('/clientes')
      .send({
        nome: 'João Silva',
        CPF: '123.456.789-00',
        CEP: '01001-000'
      });

    expect(response.status).toBe(201);
  });

  it('CT-006 - Deve atualizar dados de cliente existente', async () => {
    const cliente = await ClienteFactory.create(
      'Carlos', '98765432100', '01001000', 'Rua A', 'Bairro B', 'São Paulo', 'SP', '100', ''
    );

    const response = await request(app)
      .put(`/clientes?id=${cliente.id}`)
      .send({ nome: 'Carlos Eduardo' });

    expect(response.status).toBe(200);
  });

  it('CT-007 - Deve deletar cliente por parâmetro de URL', async () => {
    const cliente = await ClienteFactory.create(
      'Marcos', '11111111111', '01001000', 'Rua B', 'Centro', 'SP', 'SP', '12', ''
    );

    const response = await request(app).delete(`/clientes/${cliente.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-014 - Deve listar todos os clientes cadastrados', async () => {
    const response = await request(app).get('/clientes');

    expect(response.status).toBe(200);
  });

  it('CT-015 - Deve buscar cliente específico por ID', async () => {
    const cliente = await ClienteFactory.create(
      'Fernanda', '22233344455', '01001000', 'Rua C', 'Centro', 'SP', 'SP', '50', ''
    );

    const response = await request(app).get(`/clientes/${cliente.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-016 - Deve retornar 404 ao buscar cliente com ID inexistente', async () => {
    const response = await request(app).get('/clientes/9999');

    expect(response.status).toBe(404);
  });

  it('CT-017 - Deve retornar 400 ao tentar criar cliente sem CPF', async () => {
    const response = await request(app)
      .post('/clientes')
      .send({ nome: 'Sem CPF', CEP: '01001-000' });

    expect(response.status).toBe(400);
  });

  it('CT-018 - Deve retornar 400 ao tentar atualizar cliente sem informar ID', async () => {
    const response = await request(app)
      .put('/clientes')
      .send({ nome: 'Novo Nome' });

    expect(response.status).toBe(400);
  });

  it('CT-019 - Deve retornar 404 ao tentar deletar cliente com ID inexistente', async () => {
    const response = await request(app).delete('/clientes/9999');

    expect(response.status).toBe(404);
  });

});