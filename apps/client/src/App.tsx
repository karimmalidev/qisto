import { Button } from "@/components/ui/button"
import { getDb } from "./db"
import { users } from "./db/schema"

import { invoke } from "@tauri-apps/api/core"

export function App() {
  const onClick = async () => {
    const db = await getDb()
    const insertReturn = await db
      .insert(users)
      .values({ name: "John Doe" })
      .returning()
    const findManyReturn = await db.query.users.findMany()
    console.log({ insertReturn })
    console.log({ findManyReturn })
    console.log("OK")

    await testKeyring()
  }
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2" onClick={onClick}>
            Button
          </Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App

async function testKeyring() {
  const service = "com.myapp.service" // Use reverse domain syntax for OS keyrings
  const account = "user_session"

  // 1. Store
  try {
    console.log("Attempting to store token...")
    await invoke("store_user_token", {
      service,
      account,
      token: "Here is a token 2",
    })
    console.log("Token successfully stored!")
  } catch (err) {
    console.error("Store Failed:", err)
    return // Stop execution if store failed
  }

  // 2. Retrieve
  try {
    console.log("Attempting to fetch token...")
    const token = await invoke("get_user_token", {
      service,
      account,
    })
    console.log("Token retrieved successfully:", token)
  } catch (err) {
    console.error("Fetch Failed:", err)
  }
}

testKeyring()
