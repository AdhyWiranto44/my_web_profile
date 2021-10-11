import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Navbar from '../components/navbar'
import Footer from '../components/footer'

import 'tailwindcss/tailwind.css'

import profilePic from '../public/img/profile-3.webp'

export default function Home() {
  return (
    <div className="h-screen flex flex-wrap content-between">
      <Navbar />
      <div className="container mx-auto my-10">
        <div className="mx-auto filter drop-shadow-md mb-6 w-44">
          <Image className="rounded-lg" src={profilePic} alt="Adhy Wiranto" />
        </div>
        <h1 className="text-center font-bold text-2xl md:text-4xl mb-3">Hello, I'm Adhy</h1>
        <p className="text-center mt-2 md:px-40 xl:px-80">An Informatics Engineering graduate passionate about coding and new technologies, creative, great contributor, loves Artificial Intelligence things, proficient in Web Development and Software Engineering.</p>
        <p className="text-center mt-2">
          learn more <Link href="/about"><a className="underline">about me</a></Link>
        </p>
      </div>
      <Footer />
    </div>
  )
}
