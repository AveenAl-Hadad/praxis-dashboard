export type Insurance = 'gesetzlich' | 'privat' | 'selbstzahler';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO yyyy-mm-dd
  insurance: Insurance;
}
