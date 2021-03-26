import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import './body.css'
import Api from '../../utils/api/api';
import InputMask from 'react-input-mask';


export interface dadosConsulta {
    id: number,
    nome: string,
    endereco: string,
    cep: string,
    cpf: string,
    dataNasc: string
}

const Body = () => {
    let { url } = useRouteMatch();
    const [dados, setDados] = useState<dadosConsulta>();
    const [cadastro, setCadastro] = useState(false);
    const [atualizar,setAtualizar]= useState(false);
    const [camposAtualizar,setCamposAtualizar]= useState(false);
    const [consultar, setConsultar] = useState(false);
    const [excluir,setExcluir] = useState(false);
    const [values, setValues] = useState(url == '/Consultar'  ?  null :{});
    const [loading, setLoading] = useState(false);
    


    const handleChange = (event: any) => {
        if (consultar || excluir) {
            setValues(event.target.value);
        } else {
            const auxValues: any = { ...values };
            auxValues[event.target.name] = event.target.value;
            setValues(auxValues);
            
        }
    };



    const consultarCliente = async (cpf?:any) => {
        setCamposAtualizar(false);
        setLoading(true);
        setDados(undefined);
       
        var resultado= cpf ? cpf.cpf : values;
        if (resultado) {
            await Api.get('/clientes/' + resultado)
                .then(function (response) {
                   
                    if(url=="/Atualizar"){
                        setCamposAtualizar(true);
                    }
                    setDados(response.data);
                    setLoading(false);
                }).catch((e) => {
                    
                    if (e.response.status == 404) {
                        alert(e.response.data);
                    } else if (e.response.status == 409) {
                        alert(e.response.data);
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
            alert("O CPF não pode ser vazio");
        }

    }

    const excluirCliente = async () =>{
        setLoading(true);
        setDados(undefined);
        
        if (values) {
            await Api.delete('/clientes/' + values)
                .then(function (response) {
                    alert(response.data);
                    setLoading(false);
                }).catch((e) => {
                    
                    if (e.response.status == 404) {
                        alert(e.response.data);
                    } else if (e.response.status == 400) {
                        alert(e.response.data);
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
            alert("O CPF não pode ser vazio");
        }

    }

    const handleSubmit = (callback: any) => (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        callback();

    };

    useEffect((): void => {
        if (url == "/Excluir") {
            setExcluir(true);
        } else if (url == "/Consultar") {
            setConsultar(true);

        }else if(url == "/Atualizar"){
            setAtualizar(true);
        
        }else {
            setCadastro(true);
        }
    }, []);

    const atualizarCliente = async () =>{
        setLoading(true);
        await Api.put('/clientes', values)
            .then(function (response) {
                alert(response.data);
                setLoading(false);
                window.location.reload();
            }).catch((e) => {
                if (e.response.status == 404) {
                    alert(e.response.data);
                } 
                setLoading(false);
            });

    }

    async function cadastrarCliente() {
        
        setLoading(true);

        await Api.post('/clientes', values)
            .then(function (response) {
                alert("Cadastro efetuado com sucesso ");
                setLoading(false);
                window.location.reload();
            }).catch((e) => {
                if (e.response.status == 400) {
                    alert(e.response.data);
                } else if (e.response.status == 409) {
                    alert(e.response.data);
                }
                setLoading(false);
            });

    }





    return (
        <>
            <div className='container'>
                <div className="cadastro ">
                    {cadastro ?
                        <>
                          <p className='textConsulta'>Cadastro</p>
                        <form onSubmit={handleSubmit(cadastrarCliente)}>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="nome"
                                placeholder="Digite o seu nome"
                            />
                            <InputMask
                                onChange={handleChange}
                                mask="999.999.999-99"
                                type="text"
                                name="cpf"
                                placeholder="Digite o seu cpf"
                            />
                            <InputMask
                                onChange={handleChange}
                                type="text"
                                mask="99999-999"
                                name="cep"
                                placeholder="Digite seu CEP"
                            />
                            <input
                                onChange={handleChange}
                                type="text"
                                name="endereco"
                                placeholder="Digite seu Endereço"
                            />
                            <InputMask
                                onChange={handleChange}
                                type="text"
                                mask="99/99/9999"
                                name="dataNasc"
                                placeholder="Digite sua Data de Nascimento"
                            />
                            <button type="submit">{loading ? 'Enviando...' : 'Enviar'}</button>
                        </form>
                        </>
                        : consultar ?
                            <>
                                <p className='textConsulta'>Consulta</p>
                                <div className='pesquisar'>

                                    <InputMask mask='999.999.999-99' type="text" placeholder="Consulte pelo CPF" name='cpf' onChange={handleChange} />
                                    <button onClick={() => consultarCliente()}>{loading ? 'Consultando...' : 'Consultar'}</button>
                                </div>

                                <div className='dadosConsulta'>
                                    {dados ?
                                        <>
                                            <ul>
                                                <p>Nome: {dados.nome}</p>
                                                <p>CPF: {dados.cpf}</p>
                                                <p>Data de Nascimento: {dados.dataNasc}</p>
                                                <p>CEP: {dados.cep}</p>
                                                <p>Endereço: {dados.endereco}</p>
                                            </ul>
                                        </>
                                        : ""}
                                </div>
                            </>
                            : excluir ?
                                <>
                                    <p className='textConsulta'>Deletar</p>
                                    <div className='pesquisar'>

                                        <InputMask mask='999.999.999-99' type="text" placeholder="Excluir pelo CPF" name='cpf' onChange={handleChange} />
                                        <button onClick={() => excluirCliente()}>{loading ? 'Excluindo...' : 'Excluir'}</button>
                                    </div>

                                </>

                                : atualizar?
                                <>
                                <p className='textConsulta'>Atualizar</p>
                                {!camposAtualizar?
                                <div className='pesquisar'>
                                    <InputMask mask='999.999.999-99' type="text" placeholder="Digite seu CPF" name='cpf' onChange={handleChange} />
                                    <button onClick={(e) => consultarCliente(values)}>{loading ? 'Verificando CPF...' : 'Verificar'}</button>
                                </div>
                                :
                              <form onSubmit={handleSubmit(atualizarCliente)}>
                                  <input
                                     // onChange={handleChange}
                                      type="text"
                                      name="nome"
                                      disabled={true}
                                      value={dados?.nome}
                                      placeholder="Digite o seu nome"
                                  />
                                  <InputMask
                                      //onChange={handleChange}
                                      mask="999.999.999-99"
                                      type="text"
                                      disabled={true}
                                      value={dados?.cpf}
                                      name="cpf"
                                      placeholder="Digite o seu cpf"
                                  />
                                  <InputMask
                                      onChange={handleChange}
                                      type="text"
                                      mask="99999-999"
                                      name="cep"
                                      placeholder="Digite seu CEP"
                                  />
                                  <input
                                      onChange={handleChange}
                                      type="text"
                                      name="endereco"
                                      placeholder="Digite seu Endereço"
                                  />
                                  <InputMask
                                     // onChange={handleChange}
                                      value={dados?.dataNasc}
                                      type="text"
                                      disabled={true}
                                      mask="99/99/9999"
                                      name="dataNasc"
                                      placeholder="Digite sua Data de Nascimento"
                                  />
                                  <button type="submit">{loading ? 'Enviando...' : 'Enviar'}</button>
                              </form>
}
                              </>
                                
                                :""}
                </div>


            </div>
        </>
    )
}

export default Body;