import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div>
      <div className="bg-gradient-to-bl from-gray-900 to-black"></div>
      <div className="rounded-xl p-8">
        <div className="h-[calc(100%-1.5rem)] w-full animate-pulse rounded-lg bg-gray-800 sm:h-[calc(100%-2rem)]"></div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="font-geist mb-6 text-2xl font-bold text-white md:text-3xl">
              Deploy from your existing workflow
            </h3>
            <p className="mb-8 text-justify text-gray-400">
              Connect your GitHub, GitLab, or Bitbucket repository and deploy
              with every push. Our platform integrates seamlessly with your
              existing CI/CD pipeline.
            </p>

            <ul className="space-y-3">
              {[
                "Zero configuration required",
                "Automatic HTTPS and SSL",
                "Preview deployments for every PR",
                "Rollbacks with a single click",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check
                    size={20}
                    className="mt-0.5 mr-2 flex-shrink-0 text-green-500"
                  />
                  <span className="font-geist text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="glass-card aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900">
              <div className="flex items-center gap-2 border-b border-neutral-800 p-2 md:p-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500">Terminal</div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-gray-500">$ git push origin main</div>
                <div className="mt-2 text-gray-400">
                  <span className="text-green-500">✓</span> Pushed to main
                </div>
                <div className="mt-2 text-gray-400">
                  <span className="text-green-500">✓</span> Build started
                </div>
                <div className="mt-2 text-gray-400">
                  <span className="text-green-500">✓</span> Build completed
                </div>
                <div className="mt-2 text-gray-400">
                  <span className="text-green-500">✓</span> Deployed to
                  production
                </div>
                <div className="mt-4 text-gray-500">$ </div>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card mx-auto mt-8 max-w-7xl rounded-xl border border-neutral-900 p-8 text-center md:mt-12 md:p-12">
          <h3 className="font-geist mb-6 text-2xl font-bold text-white md:text-3xl">
            Ready to transform your monitoring workflow?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-gray-400">
            Join thousands of developers who&apos;ve already made the switch to
            Analytics.
          </p>
          <Button
            size="lg"
            className="font-geist gap-2 border border-[#148253] bg-[#00623A] text-white transition-colors hover:cursor-pointer hover:bg-[#2C7051] sm:w-auto"
          >
            <h1 className="font-geist font-medium">Start Tracking Now</h1>
          </Button>
        </div>
      </div>
    </div>
  );
};
