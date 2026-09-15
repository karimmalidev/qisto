import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export function PageHeader({ title }: { title?: string }) {
  return (
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
  )
}
