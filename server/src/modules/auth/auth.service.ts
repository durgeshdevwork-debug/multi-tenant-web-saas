import { User } from './models/user.model';
import { Account } from './models/account.model';
import { Session } from './models/session.model';
import { verifyPassword, generateToken } from '../../shared/utils/auth';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const account = await Account.findOne({ userId: user._id, providerId: 'credential' });
    if (!account || !account.password) return null;

    const isValid = await verifyPassword(password, account.password);
    if (!isValid) return null;

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await Session.create({
      userId: user._id,
      token,
      expiresAt: expiresAt,
    });

    return { user: user.toObject(), token };
  }

  static async logout(token: string) {
    if (token) {
      await Session.findOneAndDelete({ token });
    }
  }
}
