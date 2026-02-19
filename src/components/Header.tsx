export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16 w-auto"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">LISZT: RAPSZÓDIA</h1>
            <p className="text-sm text-muted-foreground">Hleb / Pecivo / Pica</p>
          </div>
        </div>
      </div>
    </header>
  )
}
