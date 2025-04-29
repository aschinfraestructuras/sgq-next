import { User as FirebaseUser } from 'firebase/auth';

// Estende o tipo User do Firebase para incluir as propriedades opcionais
declare module 'firebase/auth' {
  interface User extends FirebaseUser {
    displayName: string | null;
    photoURL: string | null;
  }
}

export {}; 