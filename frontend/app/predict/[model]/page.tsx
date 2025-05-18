"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { models } from "@/lib/utils"
import { Loader2, HomeIcon, Code, TrendingUp, AlertCircle } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"

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
]

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
})

type FormValues = z.infer<typeof formSchema>;

interface PredictionError {
  message: string;
  suggestion?: string;
}

export default function PredictPage() {
  const params = useParams()
  const modelParam = Array.isArray(params.model) ? params.model[0] : params.model

  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [error, setError] = useState<PredictionError | null>(null)

  const currentModel = models.find((m) => m.id === modelParam) || models[0]

  const form = useForm<FormValues>({
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
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setPrediction(null)
    setError(null)

    // Simulate steps with a more reliable approach
    const steps = [
      "Converting input into dataframe...",
      "Performing label encoding...",
      "Performing feature scaling...",
      "Reducing dimensionality...",
      "Predicting price...",
    ]

    let stepIndex = 0
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex])
        stepIndex++
      } else {
        clearInterval(stepInterval)
      }
    }, 1000)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          modelType: modelParam,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        let errorMessage = "Prediction failed";
        let suggestion = "";
        
        if (data.error && data.error.includes("timeout")) {
          errorMessage = "The prediction request timed out";
          suggestion = "Try again with a simpler model like Linear Regression or Ridge Regression";
        } else if (data.details && typeof data.details === 'string') {
          errorMessage = data.details;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        throw new Error(errorMessage, { cause: { suggestion } });
      }

      setPrediction(data.prediction)
    } catch (error: unknown) {
      console.error("Error:", error)
      
      if (error instanceof Error) {
        setError({ 
          message: error.message || "An unexpected error occurred", 
          suggestion: (error.cause as { suggestion?: string })?.suggestion || "Please try again or select a different model" 
        })
      } else {
        setError({
          message: "An unexpected error occurred",
          suggestion: "Please try again or select a different model"
        })
      }
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
      setCurrentStep(null)
    }
  }

  // Format Indian currency
  function formatIndianCurrency(value: number): string {
    const number = Math.floor(value).toString()
    const lastThree = number.slice(-3)
    const otherNumbers = number.slice(0, -3)
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree
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
                    key={name}
                    control={form.control}
                    name={name as keyof FormValues}
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
                    key={name}
                    control={form.control}
                    name={name as keyof FormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder={`Select ${String(label).toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((opt) => (
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
          
          {/* Display loading state */}
          {loading && (
            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20 max-w-lg mx-auto">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-center">Processing Request</h3>
                {currentStep && <p className="text-center">{currentStep}</p>}
                <p className="text-center text-muted-foreground mt-2 text-sm">
                  Complex models may take longer to load and process
                </p>
              </div>
            </div>
          )}
          
          {/* Display error */}
          {error && (
            <div className="mt-6 p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Error</h3>
              </div>
              <p>{error.message || "An error occurred during prediction"}</p>
              {error.suggestion && (
                <p className="mt-2 text-sm">{error.suggestion}</p>
              )}
            </div>
          )}
          
          {/* Display prediction result */}
          {prediction !== null && !loading && !error && (
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
  )
}