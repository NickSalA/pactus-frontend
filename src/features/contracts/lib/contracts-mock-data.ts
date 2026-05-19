import type { DocumentFlatten, DocumentType } from '@/types/api.types';

export type ContractFolder = {
  id: number;
  name: string;
};

export const CONTRACT_FOLDER_TYPES: Record<number, DocumentType> = {
  1: 'COMPANY',
  2: 'LABOR',
};

export const INITIAL_CONTRACT_FOLDERS: ContractFolder[] = [
  { id: 1, name: 'Clientes' },
  { id: 2, name: 'Trabajadores' },
];

export const INITIAL_CONTRACTS_BY_FOLDER: Record<number, DocumentFlatten[]> = {
  1: [],
  2: [],
};
