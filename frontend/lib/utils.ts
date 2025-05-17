import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merged utility function to handle class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Original models array remains the same
export const models = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    description: "Classic linear approach for price prediction",
    metrics: {
      r2: 0.82,
      rmse: 3987.80
    },
    icon: "LineChart"
  },
  {
    id: "ridge-regression",
    name: "Ridge Regression",
    description: "Linear regression with L2 regularization",
    metrics: {
      r2: 0.83,
      rmse: 3987.78
    },
    icon: "LineChart"
  },
  {
    id: "elastic-net",
    name: "ElasticNet",
    description: "Combines L1 and L2 regularization",
    metrics: {
      r2: 0.79,
      rmse: 4258.98
    },
    icon: "Network"
  },
  {
    id: "lasso-regression",
    name: "Lasso Regression",
    description: "Linear regression with L1 regularization",
    metrics: {
      r2: 0.81,
      rmse: 3987.86
    },
    icon: "Minimize2"
  },
  {
    id: "bayesian-ridge",
    name: "Bayesian Ridge",
    description: "Probabilistic approach to regression",
    metrics: {
      r2: 0.82,
      rmse: 3887.77
    },
    icon: "Network"
  },
  {
    id: "random-forest",
    name: "Random Forest",
    description: "Ensemble learning using multiple decision trees",
    metrics: {
      r2: 0.96,
      rmse: 1933.86
    },
    icon: "Trees"
  },
  {
    id: "gradient-boosting",
    name: "Gradient Boosting",
    description: "Boosting trees for improved accuracy",
    metrics: {
      r2: 0.92,
      rmse: 2692.21
    },
    icon: "Gauge"
  },
  {
    id: "xgboost",
    name: "XGBoost",
    description: "Advanced gradient boosting implementation",
    metrics: {
      r2: 0.95,
      rmse: 1989.33
    },
    icon: "Zap"
  }
];
