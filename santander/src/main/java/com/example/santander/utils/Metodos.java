package com.example.santander.utils;

import com.example.santander.dominios.Cliente;
import java.util.Calendar;

public class Metodos {

    public String retirarMask(String cpf) {
        String removerMask = cpf.replace(".", "").replace("-", "").replace("_", "").trim();
        return removerMask;
    }

    public Boolean validarCampos(Cliente cliente) {
        try {
            if (retirarMask(cliente.getCep()).trim().length() < 8 || cliente.getDataNasc().trim().length() < 8 || cliente.getEndereco().trim().length() < 5
                    || cliente.getNome().trim().length() < 3
            ) {
                return false;
            }
            String[] dataFornecida = cliente.getDataNasc().split("/");
            Integer anoFornecido = Integer.valueOf(dataFornecida[2]);
            Integer diaFornecido = Integer.valueOf(dataFornecida[0]);
            Integer mesFornecido = Integer.valueOf(dataFornecida[1]);
            Calendar calendario = Calendar.getInstance();
            Integer anoValido = calendario.getWeekYear() - 18;

            if (anoFornecido > anoValido || diaFornecido < 1 || diaFornecido > 31 || mesFornecido > 12 || mesFornecido < 1) {
                return false;
            }

            return true;
        } catch (NullPointerException e) {
            return false;
        }
    }


    public Boolean validaCpf(String cpf) {
        if (cpf.isBlank()) {
            return false;
        }
        String formatCpfOne = retirarMask(cpf);
        if (formatCpfOne.length() == 11) {

            if (formatCpfOne.equals("00000000000") || formatCpfOne.equals("11111111111")
                    || formatCpfOne.equals("22222222222") || formatCpfOne.equals("33333333333")
                    || formatCpfOne.equals("44444444444") || formatCpfOne.equals("55555555555")
                    || formatCpfOne.equals("66666666666") || formatCpfOne.equals("77777777777")
                    || formatCpfOne.equals("88888888888") || formatCpfOne.equals("99999999999")
            ) {
                return false;
            }
            return true;
        } else {
            return false;

        }

    }


}
