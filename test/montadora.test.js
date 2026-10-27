import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { MontadoraFactory } from './factories/MontadoraFactory.js';

describe('Testes de Integração - Montadoras', () => {

  it('CT-001 - Deve criar uma nova montadora com sucesso (201 Created)', async () => {
    const response = await request(app)
      .post('/montadoras')
      .send({ nome: 'Toyota', pais: 'Japão' });

    expect(response.status).toBe(201);
    expect(response.body.mensagem).toBe('Montadora criada com sucesso');
  });

  it('CT-002 - Deve retornar 404 ao tentar atualizar montadora com ID inexistente', async () => {
    const response = await request(app)
      .put('/montadoras?id=9999')
      .send({ nome: 'Honda', pais: 'Japão' });

    expect(response.status).toBe(404);
  });

  it('CT-003 - Deve deletar montadora por ID com sucesso', async () => {
    const montadora = await MontadoraFactory.create('Nissan', 'Japão');

    const response = await request(app).delete(`/montadoras/${montadora.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-004 - Deve listar todas as montadoras cadastradas (200 OK)', async () => {
    const response = await request(app).get('/montadoras');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('CT-011 - Deve retornar 400 ao tentar criar montadora sem o campo nome', async () => {
    const response = await request(app)
      .post('/montadoras')
      .send({ pais: 'Alemanha' });

    expect(response.status).toBe(400);
  });

  it('CT-012 - Deve buscar montadora por ID com sucesso', async () => {
    const montadora = await MontadoraFactory.create('BMW', 'Alemanha');

    const response = await request(app).get(`/montadoras/${montadora.id}`);

    expect(response.status).toBe(200);
  });

  it('CT-013 - Deve retornar 400 ao tentar atualizar montadora sem enviar ID', async () => {
    const response = await request(app)
      .put('/montadoras')
      .send({ nome: 'Ford', pais: 'EUA' });

    expect(response.status).toBe(400);
  });

});