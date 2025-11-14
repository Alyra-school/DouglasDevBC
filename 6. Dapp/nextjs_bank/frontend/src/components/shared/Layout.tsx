import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default Layout