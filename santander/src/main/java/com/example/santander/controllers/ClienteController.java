package com.example.santander.controllers;

import com.example.santander.dominios.Cliente;
import com.example.santander.repositorios.ClienteRepositorio;
import com.example.santander.utils.Metodos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clientes")
public class ClienteController {
    private Metodos metodos=new Metodos();

    @Autowired
    private ClienteRepositorio clienteRepositorio;


    @PostMapping
    public ResponseEntity cadastrar(@RequestBody Cliente cliente){

        if(metodos.validarCampos(cliente)) {
            if (metodos.validaCpf(cliente.getCpf())) {
                Boolean isCliente = isCliente(metodos.retirarMask(cliente.getCpf()));
                if (!isCliente) {
                    try {
                        cliente.setCpf(metodos.retirarMask(cliente.getCpf()));
                        clienteRepositorio.save(cliente);
                        return ResponseEntity.created(null).build();
                    } catch (NullPointerException e) {
                        return ResponseEntity.badRequest().build();
                    }
                } else {
                    return ResponseEntity.status(409).body("CPF já cadastrado !");
                }

            }
        }else{
            return ResponseEntity.badRequest().body("Campos Invalidos!");
        }

        return ResponseEntity.badRequest().body("Algo deu errado tente novamente!");
    }

    @GetMapping("/{cpf}")
    public ResponseEntity consultarCliente(@PathVariable String cpf){
            if(!metodos.validaCpf(cpf)){
                return ResponseEntity.status(404).body("Usuário não encontrado!");
            }
            try {
                Cliente cliente = clienteRepositorio.getCliente(metodos.retirarMask(cpf));
                if (cliente == null || cliente.equals("null")) {
                    throw new Exception();
                }
                return ResponseEntity.ok(cliente);
            } catch (Exception e) {
                return ResponseEntity.status(404).body("Usuário não encontrado!");
            }

    }


    @DeleteMapping("/{cpf}")
    public ResponseEntity deletarUmCliente(@PathVariable String cpf){
        if(isCliente(metodos.retirarMask(cpf))){
            if(!metodos.validaCpf(cpf)){
                return ResponseEntity.status(404).body("Usuario não encontrado!");
            }

            try {
                Cliente cliente = clienteRepositorio.getCliente(metodos.retirarMask(cpf));
                clienteRepositorio.deleteById(cliente.getId());
                return ResponseEntity.ok().body("Usuário deletado com sucesso!");
            }catch (Exception e){
                return ResponseEntity.badRequest().body("Algo deu errado tente novamente!");
            }
        }
        return ResponseEntity.status(404).body("Usuario não encontrado!");
    }

    @PutMapping
    public ResponseEntity atualizarDadosDoCliente(@RequestBody Cliente clienteAtt){
        if(isCliente(metodos.retirarMask(clienteAtt.getCpf()))){
            Cliente cliente = clienteRepositorio.getCliente(metodos.retirarMask(clienteAtt.getCpf()));
            cliente.setCep(clienteAtt.getCep());
            cliente.setEndereco(clienteAtt.getEndereco());
            clienteRepositorio.save(cliente);
            return ResponseEntity.created(null).body("Usuário atualizado com sucesso!");
        }
        return ResponseEntity.status(404).body("Usuário não encontrado!");
    }


    public Boolean isCliente(String cpf){
       ResponseEntity resposta = consultarCliente(cpf);

       if(resposta.getStatusCode().value()==404){
           return false;
       }
       return true;
    }

}
