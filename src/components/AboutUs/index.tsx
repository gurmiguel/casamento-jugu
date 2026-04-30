/* eslint-disable @next/next/no-img-element */
import { H2, P } from '~/components/ui/typography'

export function AboutUs() {
  return (
    <div className="px-6">
      <div className="container mx-auto text-center flex flex-col items-center gap-4 py-16">
        <H2>Sobre nós</H2>

        <P className="max-w-4xl mt-16 text-left text-xl leading-tight">
          <img src="https://picsum.photos/id/58/1280/853" alt="" className="float-left mr-8 mb-8" width={380} />
        Elit cillum duis laborum nulla laborum ex ut fugiat culpa enim. Magna nisi cupidatat occaecat officia esse fugiat exercitation velit aute tempor dolor labore irure irure. Reprehenderit culpa do dolore et exercitation ullamco adipisicing sit enim veniam ullamco nulla esse. Minim commodo excepteur cillum nostrud sint anim exercitation incididunt eiusmod culpa do. Aliquip reprehenderit qui officia consectetur enim sunt ipsum nisi aliqua deserunt. Aute elit deserunt qui aliquip culpa quis eiusmod proident mollit in ad aliqua. Labore mollit nisi occaecat nulla culpa consequat tempor cupidatat nisi cupidatat id adipisicing do.
          <br/>
          <br/>Fugiat minim fugiat reprehenderit do incididunt eu anim fugiat id dolore. Eu Lorem eu amet dolor aliquip ad cupidatat ut enim aliquip aliqua consequat. Ea laborum occaecat consectetur labore nostrud ipsum ullamco id officia cupidatat occaecat officia proident. Elit aute esse ullamco ullamco ipsum magna veniam officia nostrud magna duis quis laborum nisi.
          <img src="https://picsum.photos/id/64/4326/2884" alt="" className="float-right ml-8 mt-8" width={380} />
          <br/>
          <br/>Laborum voluptate nulla et quis incididunt commodo proident amet eu. Sunt ullamco ex aliqua consequat tempor irure nisi pariatur quis ea et nisi. Est aute fugiat labore adipisicing et elit enim cillum quis anim voluptate et labore. Nulla duis esse ipsum officia minim dolore nisi aliquip laborum cillum nisi est sint. Pariatur amet ea occaecat eiusmod anim exercitation Lorem. Enim ut occaecat ea dolore voluptate pariatur cupidatat eiusmod aliquip.
        </P>
      </div>
    </div>
  )
}
