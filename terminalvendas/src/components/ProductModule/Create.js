import React, { useState } from 'react';
import { Form } from '@unform/web';
import Input from '../Form/Input';
import api from '../services/api';
import css from '../css/update.module.css';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Create() {
  const [redirectCheck, setRedirecCheck] = useState(false);
  const handleSubmit = async (data) => {
    try {
      const { nome, qtd_estoque, valor_custo, valor_venda } = data;

      const newData = {
        nome: nome,
        qtd_estoque: Number(qtd_estoque),
        valor_custo: parseFloat(valor_custo),
        valor_venda: parseFloat(valor_venda),
      };

      await api
        .post(`/produto`, newData)
        .then((response) => {})
        .catch((error) => {
          console.log(error.message);
        });
      setRedirecCheck(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container center" align="center">
      <div id={css.form}>
        <Form onSubmit={handleSubmit}>
          <div className="form">
            <div className="form">
              <label for="inputName">Produto</label>

              <Input
                type="text"
                className="form-control"
                id="inputName"
                name="nome"
                placeholder="Ex: Coca-Cola, Doritos"
              />
            </div>

            <div className="form-container">
              <label for="inputQuantidade">Quantida</label>

              <Input
                name="qtd_estoque"
                type="number"
                min="0"
                max="10000"
                step="1"
                className="form-control"
                id="inputQuantidade"
                placeholder="10"
              />
            </div>

            <div className="form-group">
              <label for="inputCompra">Valor de custo</label>
              <Input
                name="valor_custo"
                type="number"
                min="0.00"
                max="10000.00"
                step="0.01"
                className="form-control"
                id="inputCompra"
                placeholder="100.00"
              />
            </div>
            <div className="form-group">
              <label for="inputVenda">Valor de Venda</label>
              <Input
                type="number"
                min="0.00"
                max="10000.00"
                step="0.01"
                name="valor_venda"
                className="form-control"
                id="inputVenda"
                placeholder="100.00"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            Cadastrar
          </button>
          {redirectCheck === true ? <Redirect to="/produto" /> : redirectCheck}
        </Form>
      </div>
    </div>
  );
}
