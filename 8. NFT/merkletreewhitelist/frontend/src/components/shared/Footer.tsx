const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 md:h-20 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} Alyra. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer