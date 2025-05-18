"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { models } from "@/lib/utils";
import { Loader2, HomeIcon, Code, TrendingUp } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";

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

const formSchema = z.object({
  model: z.string(),
  transmission: z.string(),
  fuelType: z.string(),
  make: z.string(),
  year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  mileage: z.string(),
  tax: z.string(),
  mpg: z.string(),
  engineSize: z.string(),
});

export default function PredictPage() {
  const params = useParams();
  const modelParam = Array.isArray(params.model) ? params.model[0] : params.model;

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const currentModel = models.find((m) => m.id === modelParam) || models[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      transmission: "",
      fuelType: "",
      make: "",
      year: "",
      mileage: "",
      tax: "",
      mpg: "",
      engineSize: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setCurrentStep("Converting input into dataframe...");

    await new Promise((r) => setTimeout(r, 3000));
    setCurrentStep("Performing label encoding...");

    await new Promise((r) => setTimeout(r, 3000));
    setCurrentStep("Performing feature scaling...");

    await new Promise((r) => setTimeout(r, 3000));
    setCurrentStep("Reducing dimensionality...");

    await new Promise((r) => setTimeout(r, 3000));
    setCurrentStep("Predicting price...");

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          modelType: modelParam,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  }

  function formatIndianCurrency(value: number): string {
    const number = Math.floor(value).toString();
    const lastThree = number.slice(-3);
    const otherNumbers = number.slice(0, -3);
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="absolute top-5 right-5 transform translate-x-0 z-50">
        <FloatingDock items={dockItems} />
      </div>
      <Card className="max-w-2xl mx-auto border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Price Prediction with {currentModel.name}</span>
          </CardTitle>
          <CardDescription>
            This model has an R² score of {currentModel.metrics.r2.toFixed(2)} and RMSE of{" "}
            {currentModel.metrics.rmse.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: "model", label: "Car Model", placeholder: "e.g., Kuga" },
                  { name: "make", label: "Make", placeholder: "e.g., Ford" },
                  { name: "year", label: "Year", placeholder: "e.g., 2020" },
                  { name: "mileage", label: "Mileage", placeholder: "e.g., 50000" },
                  { name: "tax", label: "Tax", placeholder: "e.g., 150" },
                  { name: "mpg", label: "MPG", placeholder: "e.g., 55.4" },
                  { name: "engineSize", label: "Engine Size", placeholder: "e.g., 2.0" },
                ].map(({ name, label, placeholder }) => (
                  <FormField
                    key={String(name)}
                    control={form.control}
                    name={name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input placeholder={placeholder} {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {[
                  {
                    name: "transmission",
                    label: "Transmission",
                    options: ["manual", "automatic"],
                  },
                  {
                    name: "fuelType",
                    label: "Fuel Type",
                    options: ["petrol", "diesel", "hybrid", "other"],
                  },
                ].map(({ name, label, options }) => (
                  <FormField
                    key={String(name)}
                    control={form.control}
                    name={name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder={`Select ${String(label).toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(options as string[]).map((opt: string) => (
                              <SelectItem key={opt} value={opt}>
                                {opt[0].toUpperCase() + opt.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Predict Price"
                )}
              </Button>
            </form>
          </Form>
          {currentStep && (
            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20 max-w-lg mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-center">Current Step</h3>
              <p className="text-center">{currentStep}</p>
            </div>
          )}
          {prediction !== null && (
            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20 max-w-lg mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-center">Predicted Price</h3>
              <p className="text-4xl font-bold text-primary text-center">
                £ {Math.floor(prediction).toLocaleString()}
              </p>
              <p className="text-center">OR</p>
              <p className="text-4xl font-bold text-primary text-center">
                ₹ {formatIndianCurrency(prediction * 106.55)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
