import Template from "@/components/shared/Template";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Template>
        {children}
    </Template>
  );
}