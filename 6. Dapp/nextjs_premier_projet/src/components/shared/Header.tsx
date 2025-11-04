import Link from "next/link"

const Header = () => {
  return (
    <>
        <Link href="/">Accueil</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
    </>
  )
}

export default Header