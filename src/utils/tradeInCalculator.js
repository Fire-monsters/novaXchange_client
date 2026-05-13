/**
 * Trade-in value calculator
 * Future: replace with API call to backend with dynamic pricing from MongoDB
 * @param {Object} params - { brand, year, condition, ram }
 * @returns {number} estimated value in UGX
 */
export const calculateTradeInValue = ({ brand, year, condition, ram }) => {
  // Base values per brand (UGX)
  const baseValues = {
    'Apple (MacBook)': 1800000,
    'Dell': 900000,
    'Lenovo': 850000,
    'HP': 800000,
    'Asus': 780000,
    'Acer': 700000,
    'Samsung': 750000,
    'Other': 600000,
  }

  // Year multipliers
  const yearMultiplier = {
    '2024': 0.85,
    '2023': 0.75,
    '2022': 0.65,
    '2021': 0.55,
    '2020': 0.45,
    '2019': 0.35,
    '2018 or older': 0.25,
  }

  // Condition multipliers
  const conditionMultiplier = {
    'Excellent (like new)': 1,
    'Good (minor scratches)': 0.85,
    'Fair (visible wear)': 0.65,
    'Poor (damaged)': 0.4,
  }

  // RAM multipliers
  const ramMultiplier = {
    '4GB': 0.8,
    '8GB': 1,
    '16GB': 1.2,
    '32GB+': 1.4,
  }

  const base = baseValues[brand] || 600000
  const yearMult = yearMultiplier[year] || 0.5
  const conditionMult = conditionMultiplier[condition] || 0.7
  const ramMult = ramMultiplier[ram] || 1

  const rawValue = base * yearMult * conditionMult * ramMult
  // Round to nearest 10,000 UGX
  return Math.round(rawValue / 10000) * 10000
}