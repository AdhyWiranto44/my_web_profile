import Image from 'next/image'
import Link from 'next/link'

import icon from '../public/img/icon-3.webp'

import 'tailwindcss/tailwind.css'

export default function Navbar() {
    return (
        <div className="md:container mx-auto">
            <div className="p-4 float-left">
                <Link href="/">
                    <a><Image src={icon} width={36} height={36} /></a>
                </Link>
            </div>
            <ul className="py-5">
                <li className="inline mr-6">
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li className="inline mr-6">
                    <Link href="/projects">
                        <a>Projects</a>
                    </Link>
                </li>
                <li className="inline mr-6">
                    <Link href="/blog">
                        <a>Blog</a>
                    </Link>
                </li>
                <li className="inline mr-6">
                    <Link href="/about">
                        <a>About</a>
                    </Link>
                </li>
                <li className="inline mr-6">
                    <Link href="#">
                        <a>Timeline</a>
                    </Link>   
                </li>
            </ul>
        </div>
    )
}