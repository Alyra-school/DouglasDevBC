import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const Template = ({ children }: {children : React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-5">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Template