import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form } from '@unform/web';
import Input from '../Form/Input';
import api from '../services/api';

import 'bootstrap/dist/css/bootstrap.min.css';
import css from '../css/get.module.css';
import { FaTrash } from 'react-icons/fa';

export default function Create() {
  // const [allRequests, setAllRequests] = useState([]);
  const [numberOrder, setNumberOrder] = useState();
  const [redirectCheck, setRedirecCheck] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [valueTotal, setValueTotal] = useState();
  const [userId, setUserId] = useState();
  // const [activation, setActivation] = useState(false);
  const [getOrderId, setGetOrderId] = useState([]);
  const [userComplete, setUserComplete] = useState();

  useEffect(() => {
    try {
      const apiAsync = async () => {
        const { data } = await api.get(`/todospedidos`);

        if (data.length === 0) {
          const newData = {
            obs: 'primeiro pedido',
          };
          await api.post(`/novopedido`, { ...newData });
        }
      };
      apiAsync();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Campo Numero do pedido
  useEffect(() => {
    try {
      const apiAsync = async () => {
        const { data } = await api.get(`/todospedidos`);
        // setAllRequests(data);

        const mapPedido = data.map((pedido) => pedido.id_pedido);
        let number = Math.max.apply(null, mapPedido);
        if (number === -Infinity) number = 1;
        setNumberOrder(number);
      };
      apiAsync();
    } catch (error) {
      console.log(error);
    }
  }, [numberOrder]);

  useEffect(() => {
    try {
      const apiAsync = async () => {
        const { data } = await api.get(`relatorio/${numberOrder}`);
        setGetOrderId(data);

        const findItem = data.map((item) => {
          return item.id_cliente;
        });
        setUserId(findItem[0]);

        const getUset = await api.get(`cliente/${findItem}`);

        setUserComplete(`${getUset.data.id} - ${getUset.data.nome}`);
        if (data.length > 0) {
          const totalOrder = data
            .map((item) => item.valor_total)
            .reduce((total, produto) => total + produto);
          setValueTotal(totalOrder);
        }
      };
      apiAsync();
    } catch (error) {}
  }, [numberOrder]);

  // Selecionar o Cliente
  useEffect(() => {
    try {
      const apiAsync = async () => {
        const { data } = await api.get(`/cliente`);
        setSelectUser(data);
      };
      apiAsync();
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  // Criar um novo pedido
  const handleSubmit = async (data) => {
    try {
      const newData = {
        obs: data.obs,
      };
      await api.post(`/novopedido`, { ...newData });

      setRedirecCheck(true);
    } catch (error) {
      console.log(error);
    }
  };
  // Recebe o cliente o id e faz a separação deles
  const handleSelectOption = (select) => {
    const selectedUser = select.target.value;
    setUserComplete(selectedUser);
    setUserId(Number(selectedUser.split('-')[0]));
  };

  // Apagar todas as ordens ligada ao cliente
  const handleCancelOrder = async () => {
    const { data } = await api.get(`/relatorio/${numberOrder}`);
    if (data.length !== 0) {
      await api.delete(`apagarpedidovarios/${numberOrder}`);
      console.log('deletado');
    }
  };

  const handleDeleteProduct = async (event) => {
    console.log(event.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="row  ">
          <div className="col-2  col-sm-5 col-md-6 col-lg-7">
            <label for="select">PEDIDO Nº </label>
            <input
              type="text"
              value={numberOrder}
              disabled
              style={{ width: '30px' }}
            />
          </div>
          <div className=" col col-sm-auto">
            <label for="select">VALOR DA COMPRA</label>
            <input
              type="text"
              style={{ width: '110px' }}
              value={valueTotal}
              disabled
            />
          </div>
        </div>
        {userId ? (
          <Form onSubmit={handleSubmit}>
            <div
              className="row"
              style={{
                alignItems: 'center',
                display: 'flex',
                placeItems: 'flex-end',
              }}
            >
              <div className=" col-10 col-sm-10 center">
                <br />
                <label for="select">ADICIONAR CLIENTE</label>
                <select
                  disabled
                  className="custom-select"
                  id="select"
                  value={userComplete}
                >
                  <option>{userComplete}</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className=" col-10 col-sm-10">
                <label for="Textarea">OBSERVAÇÃO</label>
                <Input
                  multiline
                  name="obs"
                  className="form-control"
                  id="Textarea"
                  placeholder="Ex: Cartão de crédito "
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-6">
                <Link to={`/adicionarproduto/${userId}/${numberOrder}`}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Adicionar produto
                  </button>
                </Link>

                <button
                  type="submit"
                  className="btn btn-warning"
                  style={{ marginRight: '10px' }}
                >
                  Finalizar pedido
                </button>

                <Link to="/novocliente">
                  <button
                    className="btn btn-success"
                    style={{ marginRight: '10px' }}
                  >
                    Cadastrar cliente
                  </button>
                </Link>

                <Link to="/">
                  <button
                    onClick={handleCancelOrder}
                    type="button"
                    className="btn btn-danger"
                    style={{ marginRight: '10px' }}
                  >
                    Cancelar
                  </button>
                </Link>
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-10">
                <table className="table table-hover table-dark">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>valor Unidade</th>
                      <th>Valor Total</th>

                      <th>Alterar</th>
                      <th>Deletar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOrderId.map((order) => {
                      const {
                        id,
                        id_produto,
                        quantidade,
                        valor_unidade,
                        valor_total,
                      } = order;
                      return (
                        <tr key={id}>
                          <td>{id_produto}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              max={quantidade}
                              step="1"
                              style={{
                                color: 'black',
                                width: '60px',
                                fontSize: '10pt',
                              }}
                            />
                          </td>
                          <td>{valor_unidade}</td>
                          <td>{valor_total}</td>

                          <td>
                            <Link to={`/alterarCliente/${id}`}>
                              <button
                                type="button"
                                className="btn btn-warning"
                                value={id_produto}
                                style={{
                                  color: 'black',
                                }}
                              >
                                Alterar
                              </button>
                            </Link>
                          </td>

                          <td>
                            <button
                              onClick={handleDeleteProduct}
                              type="button"
                              className="btn btn-danger"
                              value={id_produto}
                              style={{
                                color: 'white',
                              }}
                            >
                              Deletar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {redirectCheck === true ? <Redirect to="/" /> : redirectCheck}
          </Form>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div
              className="row"
              style={{
                alignItems: 'center',
                display: 'flex',
                placeItems: 'flex-end',
              }}
            >
              <div className=" col-10 col-sm-10 center">
                <br />
                <label for="select">ADICIONAR CLIENTE</label>
                <select
                  onChange={handleSelectOption}
                  className="custom-select"
                  id="select"
                  value={userId}
                >
                  <option>Selecione um cliente</option>
                  {selectUser.map((user) => {
                    const { id, nome } = user;
                    return (
                      <option key={id}>
                        {id} - {nome}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* aqui */}
            <div className="row">
              <div className=" col-10 col-sm-10">
                <label for="Textarea">OBSERVAÇÃO</label>
                <Input
                  multiline
                  name="obs"
                  className="form-control"
                  id="Textarea"
                  placeholder="Ex: Cartão de crédito "
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-6">
                <Link to={`/adicionarproduto/${userId}/${numberOrder}`}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Adicionar produto
                  </button>
                </Link>

                <button
                  type="submit"
                  className="btn btn-warning"
                  style={{ marginRight: '10px' }}
                >
                  Finalizar pedido
                </button>

                <Link to="/novocliente">
                  <button
                    className="btn btn-success"
                    style={{ marginRight: '10px' }}
                  >
                    Cadastrar cliente
                  </button>
                </Link>

                <Link to="/">
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ marginRight: '10px' }}
                  >
                    Voltar
                  </button>
                </Link>
              </div>
            </div>
            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-10"></div>
            </div>
            {redirectCheck === true ? <Redirect to="/" /> : redirectCheck}
          </Form>
        )}
      </div>
    </>
  );
}
