import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Protocolos claros",
    text: "Sequência pensada como jornada — não uma lista aleatória de movimentos.",
  },
  {
    title: "Em casa, no seu ritmo",
    text: "Sessões curtas, seguras e fáceis de encaixar na rotina.",
  },
  {
    title: "Sem pressa médica pesada",
    text: "Tom calmo e moderno: apoio para o corpo, não alarmismo.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl text-primary">Dores+</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className={buttonClassName({ size: "sm" })}
            >
              Começar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
            Saúde do movimento
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground max-w-3xl leading-[1.1]">
            Alívio guiado para costas, pescoço, ombros e joelhos — sem complicar.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">
            Escolhe a zona onde sentes mais desconforto, regista como te sentes e
            segue uma jornada simples de exercícios e alongamentos pensados para
            mobilidade, consistência e confiança no dia a dia.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/signup"
              className={buttonClassName({
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Começar gratuitamente
            </Link>
            <Link
              href="/login"
              className={buttonClassName({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Já tenho conta
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Plano gratuito com 1 região e 3 exercícios — upgrade quando quiseres.
          </p>
        </section>

        <section className="bg-accent/50 border-y border-border/60 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-10 text-center">
              Porque o Dores+ funciona contigo
            </h2>
            <ul className="grid sm:grid-cols-3 gap-6 lg:gap-8">
              {benefits.map((b) => (
                <li key={b.title}>
                  <Card>
                    <h3 className="font-medium text-foreground text-lg">{b.title}</h3>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{b.text}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                Regiões que acompanhamos
              </h2>
              <p className="text-muted mt-3 leading-relaxed">
                Lombar, pescoço, ombro, joelho, quadril, punho e tornozelo — cada
                uma com protocolo ordenado e espaço preparado para vídeo ou
                ilustração no futuro.
              </p>
            </div>
            <Card className="bg-card">
              <ul className="grid grid-cols-2 gap-3 text-sm">
                {[
                  "Zona lombar",
                  "Pescoço",
                  "Ombro",
                  "Joelho",
                  "Quadril",
                  "Punho",
                  "Tornozelo",
                ].map((z) => (
                  <li
                    key={z}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {z}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-center">
          <Card className="bg-primary text-white border-0 shadow-lg">
            <h2 className="font-display text-2xl sm:text-3xl">
              Pronto para o primeiro passo?
            </h2>
            <p className="text-white/85 mt-3 text-sm sm:text-base">
              Cria uma conta, escolhe a tua região e começa hoje — leva menos de
              dois minutos.
            </p>
            <Link
              href="/signup"
              className={buttonClassName({
                size: "lg",
                variant: "secondary",
                className:
                  "mt-8 !border-0 !bg-white !text-primary shadow-none hover:!bg-white/90",
              })}
            >
              Criar conta grátis
            </Link>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-auto bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-muted leading-relaxed">
          <p className="font-display text-primary text-sm mb-2">Dores+</p>
          <p>
            Informação educativa sobre movimento e bem-estar. Não substitui
            diagnóstico ou tratamento por profissionais de saúde. Em caso de dor
            intensa, febre, perda de força ou formigueiro, procura ajuda médica.
          </p>
        </div>
      </footer>
    </div>
  );
}
