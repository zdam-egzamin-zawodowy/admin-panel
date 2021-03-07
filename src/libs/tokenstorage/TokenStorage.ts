import { isString } from "lodash";

export const DEFAULT_STORAGE_KEY = "token";

export interface TokenStorageOptions {
  key?: string;
}

export default class TokenStorage {
  public key: string;
  public token: string | null;
  constructor({ key }: TokenStorageOptions = {}) {
    this.key = isString(key) ? key : DEFAULT_STORAGE_KEY;
    this.token = this.loadToken();
  }

  private loadToken() {
    return localStorage.getItem(this.key);
  }

  private saveToken(token: string) {
    return localStorage.setItem(this.key, token);
  }

  public setToken(newToken: string) {
    this.token = newToken;
    this.saveToken(newToken);
  }
}
