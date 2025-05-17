import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { models } from "@/lib/utils";
import { LineChart, Network, Minimize2, Trees, Gauge, Zap } from "lucide-react";

import { Car, ArrowRight, Sparkles, HomeIcon, Code, Table, TrendingUp } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";

const icons = {
  LineChart,
  Network,
  Minimize2,
  Trees,
  Gauge,
  Zap,
};
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

export default function ModelsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="absolute top-5 right-5 transform translate-x-0 z-50">
                    <FloatingDock items={dockItems} />
            </div>
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold">Choose Your Model</h1>
        <p className="text-muted-foreground">
          Select from our range of advanced machine learning models
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => {
          const Icon = icons[model.icon as keyof typeof icons] || LineChart;
          return (
            <Link key={model.id} href={`/predict/${model.id}`}>
              <Card className="hover:shadow-lg transition-all hover:border-primary/50 hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{model.name}</CardTitle>
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-primary/10">
                      R² Score: {model.metrics.r2.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10">
                      RMSE: {model.metrics.rmse.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}