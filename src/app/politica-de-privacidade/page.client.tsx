import Link from 'next/link'
import { H1, H2, P, Strong } from '~/components/ui/typography'

export const UPDATED_AT = new Date('2026-05-27T12:00:00-03:00')

export default function PrivacyPolicyPageComponent() {
  return (
    <main className="container mx-auto px-6 py-16 max-w-3xl">
      <div className="-mt-8 mb-8">
        <Link href="/" className="underline hover:opacity-80">Voltar para o início</Link>
      </div>

      <div className="mb-12 text-center">
        <H1 className="text-primary mb-4">Política de Privacidade</H1>
        <P className="text-muted-foreground">Última atualização: <Strong className="underline">{UPDATED_AT.toLocaleDateString('pt-BR')}</Strong></P>
      </div>

      <div className="space-y-8 text-foreground/80 leading-relaxed">
        <section>
          <P>
            Bem-vindo(a) ao site do casamento de <Strong>Gustavo & Juliana</Strong>. A sua privacidade é muito importante para nós. Esta Política de Privacidade tem como objetivo informar como lidamos com as suas informações ao utilizar o nosso site.
          </P>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>1. Coleta de Dados</H2>
          <P>
            Nós <Strong>não utilizamos</Strong> Google Analytics, pixels de rastreamento ou qualquer outro tipo de ferramenta de tracking de terceiros. Apenas coletamos as informações que você nos fornece voluntariamente ao interagir com as funcionalidades do site, tais como:
          </P>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><Strong>Confirmação de Presença (RSVP):</Strong> Nome e outras informações necessárias para organizar a lista de convidados.</li>
            <li><Strong>Lista de Presentes:</Strong> Informações necessárias para o redirecionamento ou processamento de mensagens e presentes.</li>
          </ul>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>2. Uso das Informações</H2>
          <P>
            Todas as informações fornecidas por você serão utilizadas de forma restrita e <Strong>exclusivamente para a organização e planejamento do nosso casamento</Strong>. Não utilizaremos seus dados para fins de marketing, publicidade ou qualquer outra finalidade não relacionada ao evento.
          </P>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>3. Compartilhamento de Dados</H2>
          <P>
            Nós <Strong>não compartilhamos, vendemos, alugamos ou trocamos</Strong> as suas informações pessoais com terceiros sob nenhuma circunstância.
          </P>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>4. Cookies</H2>
          <P>
            Nosso site não utiliza cookies de rastreamento (tracking cookies) para monitorar o seu comportamento na internet. O uso de cookies é limitado apenas ao estritamente necessário para o funcionamento básico do site e de suas funcionalidades.
          </P>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>5. Seus Direitos</H2>
          <P>
            Você tem o direito de solicitar a exclusão de qualquer dado pessoal que tenha nos fornecido (como a sua confirmação de presença). Caso deseje alterar ou remover suas informações, basta entrar em contato conosco diretamente.
          </P>
        </section>

        <section>
          <H2 className="font-semibold mb-3 text-foreground" underline={false}>6. Contato</H2>
          <P>
            Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre como tratamos seus dados, por favor, sinta-se à vontade para nos contatar pelos nossos canais de comunicação habituais.
          </P>
        </section>
      </div>
    </main>
  )
}
