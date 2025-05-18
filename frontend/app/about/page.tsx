import Link from "next/link";
import {
  Car,
  LineChart,
  Zap,
  Code2,
  HomeIcon,
  Code,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";

export default function AboutPage() {
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
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About <span className="text-primary">CarPricer</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Bringing advanced machine learning to car price predictions
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                  At CarPricer, we believe that accurate car pricing should be accessible to everyone.
                  Our mission is to democratize machine learning technology by providing 
                  accurate and reliable car price predictions to help buyers and sellers make 
                  informed decisions in the automotive market.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">The Technology</h2>
                <p className="text-muted-foreground">
                  Our platform leverages multiple machine learning models including Linear Regression,
                  Ridge Regression, Decision Trees, Support Vector Machines, XGBoost, Gradient Boosting, 
                  and AdaBoost. Each model has been carefully trained and validated on a comprehensive 
                  dataset of car features and prices to ensure high accuracy and reliability.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3 py-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <LineChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold">Data-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Our models are trained on extensive automotive datasets
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold">Fast & Efficient</h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant predictions with our optimized ML pipeline
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold">Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    We share performance metrics for all our models
                  </p>
                </div>
              </div>


              <div className="pt-6">
                <Link href="/models">
                  <Button size="lg" className="w-full md:w-auto">
                    Explore Our Models
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border/40 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
            <p className="text-center text-sm leading-loose text-muted-foreground">
              © 2025 CarPricer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}