export interface Patient {
  id: string; // json-server kann string ids generieren
  firstName: string;
  lastName: string;
  birthDate: string; // yyyy-mm-dd
  insurance: string;
}