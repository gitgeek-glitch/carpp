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
import { Loader2 } from 'lucide-react'
import { Car, ArrowRight, Sparkles, HomeIcon, Code, Table, TrendingUp } from "lucide-react";
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
})

export default function PredictPage() {
  const params = useParams()
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  const currentModel = models.find(m => m.id === params.model) || models[0]

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
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setCurrentStep("Converting input into dataframe...")

    await new Promise(resolve => setTimeout(resolve, 3000))
    setCurrentStep("Performing label encoding...")

    await new Promise(resolve => setTimeout(resolve, 3000))
    setCurrentStep("Performing feature scaling...")

    await new Promise(resolve => setTimeout(resolve, 3000))
    setCurrentStep("Reducing dimensionality...")

    await new Promise(resolve => setTimeout(resolve, 3000))
    setCurrentStep("Predicting price...")

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          modelType: params.model, // Send selected model type
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch prediction')
      }

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setCurrentStep(null)
    }
  }

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
            This model has an R² score of {currentModel.metrics.r2.toFixed(2)} and RMSE of {currentModel.metrics.rmse.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Kuga" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ford" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2020" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50000" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 150" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mpg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MPG</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 55.4" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engineSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.0" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <p className="text-4xl font-bold text-primary text-center">£ {Math.floor(prediction).toLocaleString()}</p>
              <p className="text-center">OR</p>
              <p className="text-4xl font-bold text-primary text-center">₹ {formatIndianCurrency(prediction * 106.55)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}