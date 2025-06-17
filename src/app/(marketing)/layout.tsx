import { LandingLayout } from "@/modules/landing/layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <LandingLayout>{children}</LandingLayout>
    </div>
  );
};
export default Layout;
