import Link from "next/link";
import { Car, ArrowRight, Sparkles, HomeIcon, Code, Table, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";

export default function Home() {
  // Define the `items` to pass to FloatingDock component
  const dockItems = [
    {
      title: "Home",
      icon: <HomeIcon className="h-6 w-6" />,
      href: "/",
    },
    {
      title: "Code",
      icon: <Code className="h-6 w-6" />,
      href: "/code",
    },
    {
      title: "Performance Measure",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/performance",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Centered Navbar */}
      <div className="absolute top-5 right-5 transform translate-x-0 z-50">
        <FloatingDock items={dockItems} />
      </div>

      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="flex items-center justify-center" href="/">
          <Car className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">CarPricer</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Predict Car Prices with
                  <span className="text-primary ml-2">Precision</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Leverage the power of 5 simple and 3 ensemble machine learning models to get accurate car price predictions. Make
                  informed decisions with data-driven insights.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/models">
                  <Button size="lg" className="px-8">
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 p-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">8 Different Models</h3>
                  <p className="text-muted-foreground">
                    Choose from various ML models including Linear Regression, Random Forest, and XGBoost
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 p-3">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">High Accuracy</h3>
                  <p className="text-muted-foreground">
                    Our models achieve high R² scores and low RMSE values for accurate predictions
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 p-3">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Easy to Use</h3>
                  <p className="text-muted-foreground">
                    Simple interface to input car details and get instant price predictions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
