import { invoke } from "@tauri-apps/api/core"

export class TokenStore {
  private static readonly SERVICE = "com.qisto.service"
  private static readonly ACCOUNT = "user_session"

  static storeToken = async (token: string) => {
    await invoke("store_user_token", {
      service: TokenStore.SERVICE,
      account: TokenStore.ACCOUNT,
      token,
    })
  }

  static getToken = async (): Promise<string> => {
    return await invoke("get_user_token", {
      service: TokenStore.SERVICE,
      account: TokenStore.ACCOUNT,
    })
  }

  static deleteToken = async () => {
    await invoke("delete_user_token", {
      service: TokenStore.SERVICE,
      account: TokenStore.ACCOUNT,
    })
  }

  static hasToken = async (): Promise<boolean> => {
    return await invoke("has_user_token", {
      service: TokenStore.SERVICE,
      account: TokenStore.ACCOUNT,
    })
  }
}
