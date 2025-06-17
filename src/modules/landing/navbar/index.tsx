import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center bg-transparent backdrop-blur-md px-2">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <div className="flex flex-shrink-0 items-center">
          <Link href={"/"} className="hidden md:block">
            <div className="flex items-center gap-1 p-4">
              <p className="font-geist text-2xl font-semibold tracking-tight text-white">
                Analytics
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant={"custom"} className="py-2 px-4">
              <h1 className="text-xs">Get Started</h1>
            </Button>
            <Link
              href={"https://github.com/devansh193/analytics-tracker"}
              target="_blank"
            >
              <Button className="hover:cursor-pointer">
                <GithubIcon className="text-neutral-200" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
