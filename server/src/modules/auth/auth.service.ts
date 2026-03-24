import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../shared/utils/auth';

export class AuthService {
  static async login(email: string, password: string, headers: any) {
    return await auth.api.signInEmail({
      body: { email, password },
      headers: fromNodeHeaders(headers)
    });
  }

  static async logout(headers: any) {
    return await auth.api.signOut({
      headers: fromNodeHeaders(headers)
    });
  }
}
