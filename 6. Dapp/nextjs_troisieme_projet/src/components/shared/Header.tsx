const Header = () => {
  return (
    <div className="flex items-center justify-between p-5 bg-sky-400">
      <div>Logo</div>
      <nav className="w-xs">
        <ul className="flex items-center justify-between">
          <li>Liens 1</li>
          <li>Liens 2</li>
          <li>Liens 3</li>
          <li>Liens 4</li>
        </ul>
      </nav>
    </div>
  )
}

export default Header