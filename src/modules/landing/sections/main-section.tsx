import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { OnlineIndication } from "../ui/online-indicator";

export const MainSection = () => {
  return (
    <section className="relative overflow-hidden py-30 md:py-24 lg:py-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#151517] via-[black] to-black" />
      <div
        className="absolute -z-10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          backgroundColor: "rgba(100, 116, 139, 0.2)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in mx-auto max-w-4xl space-y-4 text-center">
          <div className="font-geist mb-2 inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] px-4 py-2 text-xs font-medium text-white sm:px-6 sm:py-3 sm:text-sm">
            <OnlineIndication />
            <span>Real-time monitoring for modern website</span>
          </div>
          <h1 className="px-2 text-3xl font-medium tracking-tight text-neutral-200 sm:px-0 sm:text-4xl md:text-5xl lg:text-6xl">
            Monitor Your Website&apos;s
            <br />
            <span className="">Performance & Analytics</span>{" "}
          </h1>
          <div className="mx-auto max-w-2xl px-4 text-center">
            <p className="text-gray-400 text-sm">
              Unlock real-time insights, receive instant alerts, and leverage
              actionable analytics to keep your online presence robust.
            </p>
            <h2 className="mt-4 text-lg font-instrument-serif text-gray-300 md:text-3xl">
              Because every millisecond matters.
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={"/dashboard"}>
              <Button className="w-50 text-gray-200" variant={"custom"}>
                Start Tracking <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="mt-4 text-xs text-gray-500 sm:mt-6 sm:text-sm">
            No credit card required • Free tier available
          </div>
        </div>
      </div>

      <div className="relative mt-12 p-2 sm:mt-16 md:mt-20 lg:mt-20">
        <div className="glass-card mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-xl bg-neutral-900 opacity-60 px-4 sm:rounded-t-xl sm:px-6 lg:max-w-6xl">
          <div className="flex items-center gap-2 border-b border-gray-800 p-3 sm:p-4">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3"></div>
              <div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3"></div>
            </div>
            <div className="flex-1 text-center text-[10px] text-gray-500 sm:text-xs">
              dashboard.analytics.app
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
