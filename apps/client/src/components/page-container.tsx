import type { ReactNode } from "react"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export function PageContainer({
  title,
  children,
}: {
  title?: string
  children?: ReactNode
}) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          {title && (
            <>
              <Separator orientation="vertical" className="me-2" />
              {title}
            </>
          )}
        </div>
      </header>
      <main className="min-h-[calc(100dvh-4rem)] p-4 pt-0">{children}</main>
    </>
  )
}
