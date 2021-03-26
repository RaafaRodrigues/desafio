package com.example.santander.repositorios;

import com.example.santander.dominios.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClienteRepositorio extends JpaRepository<Cliente,Integer> {


    @Query("select c from Cliente c where c.cpf = ?1")
    Cliente getCliente(String cpf);



}
