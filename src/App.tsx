import { format } from "date-fns"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ALERT_TOKENS = [
  { name: "info", value: "var(--color-info)" },
  { name: "success", value: "var(--color-success)" },
  { name: "pending", value: "var(--color-pending)" },
  { name: "warning", value: "var(--color-warning)" },
  { name: "danger", value: "var(--color-danger)" },
]

function App() {
  const today = format(new Date(), "EEEE, MMMM d, yyyy")

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <CardContent className="flex flex-col gap-6 px-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-semibold tracking-tight">Reckon</h1>
            <p className="text-base text-text-secondary">
              Back at the board.
            </p>
          </div>

          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {today}
          </p>

          <Button size="lg" className="self-start">
            <Plus />
            New Sketch
          </Button>

          <div className="flex flex-col gap-2 pt-4 border-t border-border-default">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Alert tokens
            </p>
            <div className="flex gap-2">
              {ALERT_TOKENS.map((token) => (
                <div
                  key={token.name}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className="block h-8 w-8 rounded-md ring-1 ring-foreground/10"
                    style={{ backgroundColor: token.value }}
                    title={token.name}
                  />
                  <span className="font-mono text-[10px] text-text-muted">
                    {token.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
