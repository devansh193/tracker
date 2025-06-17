import { Navbar } from "../navbar";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
