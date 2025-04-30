import { FirebaseError } from 'firebase/app';

export function handleFirebaseError(error: FirebaseError | Error): string {
  if (!isFirebaseError(error)) {
    return error.message;
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida.';
    case 'auth/weak-password':
      return 'A senha é muito fraca.';
    case 'auth/user-disabled':
      return 'Usuário desativado.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    default:
      return error.message;
  }
}

export function formatFirestoreDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error !== null && typeof error === 'object' && 'code' in error;
} 