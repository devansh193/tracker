// Import necessary components
import { Button } from "@/components/ui/button";
import { GithubIcon, Menu } from "lucide-react"; // Import Menu icon for mobile
import Link from "next/link";
import {
  // Assuming these are available from your ui library (e.g., shadcn/ui Sheet)
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const Navbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center bg-transparent px-4 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        {/* Logo/Brand Section */}
        <div className="flex flex-shrink-0 items-center">
          <Link href={"/"}>
            <div className="flex items-center gap-1">
              <p className="font-geist text-xl font-semibold text-white">
                Call Saul
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center justify-between gap-x-6 md:flex">
          {items.map((item) => (
            <Link href={item.href} key={item.href}>
              <p className="text-neutral-200 transition-colors hover:text-white">
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Action Buttons (Desktop & Mobile) */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Get Started Button (Visible on Desktop, optionally in mobile menu) */}
          <Link href={"/dashboard"} className="hidden md:block">
            <Button variant={"custom"} className="px-4 py-2 text-white">
              <span className="text-xs">Get Started</span>
            </Button>
          </Link>

          {/* GitHub Icon (Visible on all screens) */}
          <Link
            href={"https://github.com/devansh193/analytics-tracker"}
            target="_blank"
          >
            <Button className="hover:cursor-pointer">
              <GithubIcon className="text-neutral-200" size={20} />
            </Button>
          </Link>

          {/* Mobile Menu Toggle (Hamburger Icon) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu size={24} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white">
                <SheetHeader>
                  <SheetTitle className="font-geist text-xl font-semibold text-white">
                    Call Saul
                  </SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Navigation and quick links.
                  </SheetDescription>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-6">
                  {items.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className="text-lg font-medium text-neutral-200 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {/* Optionally move Get Started button here for mobile */}
                  <Link href={"/dashboard"}>
                    <Button
                      variant={"custom"}
                      className="w-full py-2 text-white"
                    >
                      <span className="text-base">Get Started</span>
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
