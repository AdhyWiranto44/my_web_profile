import 'tailwindcss/tailwind.css'

export default function Footer() {
    const github = {
        "link": "https://github.com/adhywiranto44/", 
        "name": "Github",
    }
    const linkedin = {
        "link": "https://www.linkedin.com/in/adhy-wiranto-665882155/", 
        "name": "LinkedIn",
    }
    const instagram = {
        "link": "https://instagram.com/wanindemilien",
        "name": "Instagram",
    }

    return (
        <>
            <footer className="md:container mx-auto px-4 flex justify-between pb-4 text-sm">
                <div id="left">&copy; 2021. Made with ❤ by <a href={github.link}>Adhy Wiranto</a></div>
                <div id="right">
                    <a href={linkedin.link}>{linkedin.name}</a>
                    <a className="ml-4" href={github.link}>{github.name}</a>
                    <a className="ml-4" href={instagram.link}>{instagram.name}</a>
                </div>
            </footer>
        </>
    )
}