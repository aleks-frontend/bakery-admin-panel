import { useTranslation } from "react-i18next"
import { LanguageSelector } from "./LanguageSelector"

export function Header() {
  const { t } = useTranslation()
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt={t("Logo")}
              className="h-16 w-auto"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{t("LISZT: RAPSZÓDIA")}</h1>
              <p className="text-sm text-muted-foreground">{t("Hleb / Pecivo / Pica")}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}
