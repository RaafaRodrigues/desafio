import React from 'react';
import './header.css';





const Header = () => {
    const options = ["Atualizar","Cadastrar","Consultar","Excluir"];


    return (
        <>
            <div className="App-header">
                   
                   {options.map((item) =>{
                       return(
                           <a href={`/${item}`}>
                           <p>{item}</p>
                           </a>
                       )
                   })}
                


            </div>
        </>
    )
}
export default Header;