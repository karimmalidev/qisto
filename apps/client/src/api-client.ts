import { Constants } from "@/constants"
import {
  type Login,
  loginSchema,
  syncPullSchema,
  type SyncPush,
  syncPushSchema,
} from "@qisto/schemas"
import { TokenStore } from "./token-store"

export const ApiClient = {
  login: async (input: { body: Login["request"]["body"] }) => {
    const response = await fetch(`${Constants.api.origin}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(
        loginSchema.shape.request.shape.body.parse(input.body)
      ),
    })
    const json = await response.json()
    if (!response.ok) {
      throw new Error(JSON.stringify(json))
    }
    const { token } = loginSchema.shape.response.shape.body.parse(json)
    await TokenStore.storeToken(token)
  },
  logout: async () => {
    await TokenStore.deleteToken()
  },
  sync: {
    push: async (input: { body: SyncPush["request"]["body"] }) => {
      const response = await fetch(`${Constants.api.origin}/sync/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${await TokenStore.getToken()}`,
        },
        body: JSON.stringify(
          syncPushSchema.shape.request.shape.body.parse(input.body)
        ),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(json))
      }
    },
    pull: async () => {
      const response = await fetch(`${Constants.api.origin}/sync/pull`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${await TokenStore.getToken()}`,
        },
        body: JSON.stringify({}),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(JSON.stringify(json))
      }
      return syncPullSchema.shape.response.shape.body.parse(json)
    },
  },
}
