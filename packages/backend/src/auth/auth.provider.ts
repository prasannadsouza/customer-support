import { compare, hash } from "bcrypt";

export class AuthenticationProvider {
  static async generateHash(password: string): Promise<string> {
    return hash(password, 10);
  }

  static async confirmPassword(hashed: string, password: string): Promise<boolean> {
    return compare(password, hashed)
  }
}
