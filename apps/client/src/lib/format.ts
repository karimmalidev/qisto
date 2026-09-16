export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date)
}

export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("ar-EG").format(amount)
}

export const formatCurrency = (amount: number) => {
  return `${formatNumber(amount)} جـ`
}
