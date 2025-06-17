import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-300"></div>
              <span className="text-xl font-bold text-white">Deplawyer</span>
            </div>
            <p className="mb-6 text-gray-400">
              Deploy to the edge with confidence. Streamlined deployments for
              modern web applications.
            </p>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Deplawyer Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-2">
              {[
                "Features",
                "Pricing",
                "Integrations",
                "Changelog",
                "Roadmap",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={"#"}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2">
              {[
                "Documentation",
                "Guides",
                "API Reference",
                "Blog",
                "Community",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={"#"}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Contact", "Privacy", "Terms"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={"#"}
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
