import { auth } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import type { User } from '@/types';
import { FirebaseError } from 'firebase/app';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validatePassword = (password: string): boolean => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error('A senha deve ter pelo menos 8 caracteres');
  }
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error('A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial');
  }
  return true;
};

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  if (!firebaseUser.email) {
    throw new Error('Usuário não possui email');
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || '',
    role: 'user',
    active: true,
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    lastLogin: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    avatar: firebaseUser.photoURL || undefined
  };
};

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUserToUser(userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Usuário não encontrado');
        case 'auth/wrong-password':
          throw new Error('Senha incorreta');
        case 'auth/too-many-requests':
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde');
        default:
          throw new Error('Erro ao fazer login: ' + error.message);
      }
    }
    throw new Error('Falha ao fazer login');
  }
}

export async function register(email: string, password: string, name: string): Promise<User> {
  try {
    validatePassword(password);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return mapFirebaseUserToUser(userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email já está em uso');
        case 'auth/invalid-email':
          throw new Error('Email inválido');
        case 'auth/operation-not-allowed':
          throw new Error('Operação não permitida');
        default:
          throw new Error('Erro ao registrar: ' + error.message);
      }
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error('Erro ao fazer logout: ' + error.message);
    }
    throw new Error('Falha ao fazer logout');
  }
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Nenhum usuário logado');
    }

    await updateProfile(currentUser, {
      displayName: data.name,
      photoURL: data.avatar
    });

    return mapFirebaseUserToUser(currentUser);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error('Erro ao atualizar perfil: ' + error.message);
    }
    throw new Error('Falha ao atualizar perfil');
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Usuário não encontrado');
        case 'auth/invalid-email':
          throw new Error('Email inválido');
        default:
          throw new Error('Erro ao enviar email de redefinição: ' + error.message);
      }
    }
    throw new Error('Falha ao enviar email de redefinição de senha');
  }
} 