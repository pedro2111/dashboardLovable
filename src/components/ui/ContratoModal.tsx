import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contrato } from '@/services/contratoService';
import { formatCurrency, formatCpfCnpj, formatDate } from '@/lib/utils';

interface ContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato: Contrato | null;
  isLoading: boolean;
}

const ContratoModal: React.FC<ContratoModalProps> = ({
  open,
  onOpenChange,
  contrato,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Carregando informações do contrato...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!contrato) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Histórico Contrato {contrato.nuContrato}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Contrato</p>
            <p className="text-sm">{contrato.nuContrato}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Código Contrato</p>
            <p className="text-sm">{contrato.coContrato}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">CPF/CNPJ</p>
            <p className="text-sm">{formatCpfCnpj(contrato.nuCpfCnpj.toString())}</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Valor Contrato</p>
            <p className="text-sm">{formatCurrency(contrato.vrContrato)}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Data da Contratação</p>
            <p className="text-sm">{formatDate(contrato.dtContratacao)}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Legado</p>
            <p className="text-sm">{contrato.isLegado ? 'Sim' : 'Não'}</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Situação</p>
            <p className="text-sm">{contrato.noSituacao}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Data Situação</p>
            <p className="text-sm">{formatDate(contrato.dhSituacao)}</p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Novação</p>
            <p className="text-sm">{contrato.novacao ? 'Sim' : 'Não'}</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 space-y-1">
            <p className="text-sm font-medium">Data Fim Contrato</p>
            <p className="text-sm">{formatDate(contrato.dtFimContrato)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContratoModal;