"use client"

import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Percent,
  Film,
  Calendar,
  Clock,
  Sparkles,
  BarChart3,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

// Add these interfaces at the top of the file
interface Fact {
  id: number;
  c_id: number;
  m_id: number;
  t_id: number;
  d_id: number;
  ticketsold: number;
  totalamount: number;
  discount: number;
}
interface Movie {
  m_id: number;
  title: string;
  genre: string;
  release_date: string;
  duration: number;
  rating: number;
  language: string;
}
interface Theater {
  t_id: number;
  t_name: string;
  location: string;
  totalseats: number;
  showtime: number;
  showdate: string;
}
interface DateRow {
  d_id: number;
  date: string;
  day: string;
  month: string;
  quater: number;
  year: number;
  isweekend: boolean;
}
// Add index signatures for revenue maps
interface RevenueMap { [key: string]: number; }
interface MovieRevenueMap { [key: string]: any; }
interface TheaterRevenueMap { [key: string]: any; }

// Add region mapping for Indian cities
const cityRegionMap: { [city: string]: string } = {
  'Delhi': 'North', 'Chandigarh': 'North', 'Lucknow': 'North', 'Jaipur': 'North', 'Noida': 'North', 'Gurgaon': 'North',
  'Mumbai': 'West', 'Pune': 'West', 'Ahmedabad': 'West', 'Surat': 'West', 'Vadodara': 'West',
  'Bangalore': 'South', 'Chennai': 'South', 'Hyderabad': 'South', 'Coimbatore': 'South', 'Visakhapatnam': 'South', 'Kochi': 'South',
  'Kolkata': 'East', 'Bhopal': 'Central', 'Indore': 'Central', 'Ranchi': 'East', 'Guwahati': 'East',
};
const regionOptions = ['All', 'North', 'South', 'East', 'West', 'Central'];

export default function CineDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'quarterly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [region, setRegion] = useState<string>('All');

  // Dynamic data states
  const [customers, setCustomers] = useState([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [dates, setDates] = useState<DateRow[]>([])
  const [facts, setFacts] = useState<Fact[]>([])

  // Fetch all data on mount
  useEffect(() => {
    setIsLoaded(true)
    fetch('/api/customers').then(res => res.json()).then(setCustomers)
    fetch('/api/movies').then(res => res.json()).then(setMovies)
    fetch('/api/theaters').then(res => res.json()).then(setTheaters)
    fetch('/api/dates').then(res => res.json()).then(setDates)
    fetch('/api/facts').then(res => res.json()).then(setFacts)
  }, [])

  // Get available years from dates
  const availableYears = Array.from(new Set(dates.map(d => String(d.year)))).sort();
  useEffect(() => {
    if (!selectedYear && availableYears.length > 0) setSelectedYear(availableYears[0]);
  }, [availableYears, selectedYear]);

  // Compute KPIs
  const totalRevenue = facts.reduce((sum, f) => sum + (Number(f.totalamount) || 0), 0)
  const ticketsSold = facts.reduce((sum, f) => sum + (Number(f.ticketsold) || 0), 0)
  const totalDiscounts = facts.reduce((sum, f) => sum + (Number(f.discount) || 0), 0)
  const avgTicketPrice = ticketsSold > 0 ? Math.round(totalRevenue / ticketsSold) : 0
  // Top revenue location
  const locationRevenueMap: RevenueMap = {}
  facts.forEach(f => {
    const theater = theaters.find(t => t.t_id === f.t_id)
    if (theater) {
      locationRevenueMap[theater.location] = (locationRevenueMap[theater.location] || 0) + (Number(f.totalamount) || 0)
    }
  })
  const topRevenueLocation = Object.entries(locationRevenueMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"

  // Helper to get week number from a date string
  function getWeek(dateString: string) {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Helper for quarter
  function getQuarter(month: string) {
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const idx = monthOrder.indexOf(month);
    return idx >= 0 ? Math.floor(idx / 3) + 1 : 0;
  }

  // Dynamic aggregation for chart based on period and year
  let chartData: { label: string, revenue: number }[] = [];
  if (period === 'monthly') {
    const monthlyRevenueMap: RevenueMap = {};
    facts.forEach(f => {
      const date = dates.find(d => d.d_id === f.d_id);
      if (date && String(date.year) === selectedYear) {
        const label = `${date.month}`;
        monthlyRevenueMap[label] = (monthlyRevenueMap[label] || 0) + (Number(f.totalamount) || 0);
      }
    });
    chartData = Object.entries(monthlyRevenueMap).map(([label, revenue]) => ({ label, revenue })) as { label: string, revenue: number }[];
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    chartData = chartData.sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));
  } else if (period === 'weekly') {
    const weeklyRevenueMap: RevenueMap = {};
    facts.forEach(f => {
      const date = dates.find(d => d.d_id === f.d_id);
      if (date && String(date.year) === selectedYear) {
        const week = getWeek(date.date);
        const label = `W${week}`;
        weeklyRevenueMap[label] = (weeklyRevenueMap[label] || 0) + (Number(f.totalamount) || 0);
      }
    });
    chartData = Object.entries(weeklyRevenueMap).map(([label, revenue]) => ({ label, revenue })) as { label: string, revenue: number }[];
    chartData = chartData.sort((a, b) => Number(a.label.replace('W', '')) - Number(b.label.replace('W', '')));
  } else if (period === 'quarterly') {
    const quarterlyRevenueMap: RevenueMap = {};
    facts.forEach(f => {
      const date = dates.find(d => d.d_id === f.d_id);
      if (date && String(date.year) === selectedYear) {
        const quarter = getQuarter(date.month);
        const label = `Q${quarter}`;
        quarterlyRevenueMap[label] = (quarterlyRevenueMap[label] || 0) + (Number(f.totalamount) || 0);
      }
    });
    chartData = Object.entries(quarterlyRevenueMap).map(([label, revenue]) => ({ label, revenue })) as { label: string, revenue: number }[];
    chartData = chartData.sort((a, b) => Number(a.label.replace('Q', '')) - Number(b.label.replace('Q', '')));
  }

  // Monthly revenue data
  // Sort months in calendar order
  const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthlyRevenueDataSorted = chartData.filter(item => new Date(item.label).getFullYear() === new Date().getFullYear())
    .sort((a, b) => {
      const [am, ay] = a.label.split(' ');
      const [bm, by] = b.label.split(' ');
      if (ay !== by) return Number(ay) - Number(by);
      return monthOrder.indexOf(am) - monthOrder.indexOf(bm);
    })

  // Revenue by location
  const locationRevenueData = Object.entries(locationRevenueMap).map(([location, revenue]) => ({ location, revenue })) as { location: string, revenue: number }[]

  // Top 5 movies by revenue
  const movieRevenueMap: MovieRevenueMap = {}
  facts.forEach(f => {
    const movie = movies.find(m => m.m_id === f.m_id)
    if (movie) {
      if (!movieRevenueMap[movie.title]) {
        movieRevenueMap[movie.title] = { ...movie, ticketsSold: 0, totalAmount: 0 }
      }
      movieRevenueMap[movie.title].ticketsSold += Number(f.ticketsold) || 0
      movieRevenueMap[movie.title].totalAmount += Number(f.totalamount) || 0
    }
  })
  const topMovies = Object.values(movieRevenueMap)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5)

  // Top 5 theaters by revenue
  const theaterRevenueMap: TheaterRevenueMap = {}
  facts.forEach(f => {
    const theater = theaters.find(t => t.t_id === f.t_id)
    if (theater) {
      if (!theaterRevenueMap[theater.t_name]) {
        theaterRevenueMap[theater.t_name] = { ...theater, ticketsSold: 0, totalAmount: 0 }
      }
      theaterRevenueMap[theater.t_name].ticketsSold += Number(f.ticketsold) || 0
      theaterRevenueMap[theater.t_name].totalAmount += Number(f.totalamount) || 0
    }
  })
  const topTheaters = Object.values(theaterRevenueMap)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5)

  // YoY growth calculation (if you have year info in your date table)
  let growth = 0;
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const thisYearRevenue = facts.reduce((sum, f) => {
    const date = dates.find(d => d.d_id === f.d_id);
    return date && Number(date.year) === currentYear ? sum + (Number(f.totalamount) || 0) : sum;
  }, 0);
  const lastYearRevenue = facts.reduce((sum, f) => {
    const date = dates.find(d => d.d_id === f.d_id);
    return date && Number(date.year) === lastYear ? sum + (Number(f.totalamount) || 0) : sum;
  }, 0);
  if (lastYearRevenue > 0) {
    growth = ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100;
  }

  // Add these console logs after computing the data arrays
  console.log('monthlyRevenueDataSorted', monthlyRevenueDataSorted);
  console.log('locationRevenueData', locationRevenueData);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const formatCurrency = (amount: number) => {
    if (!isFinite(amount)) return 'N/A';
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (!isFinite(num)) return 'N/A';
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getGenreColor = (genre: string) => {
    const colors = {
      Action: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 dark:text-red-400 border-red-500/30",
      Drama: "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Comedy:
        "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
      Romance: "bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-700 dark:text-pink-400 border-pink-500/30",
    }
    return (
      colors[genre as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
    )
  }

  const getLanguageColor = (language: string) => {
    const colors = {
      Hindi:
        "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
      English:
        "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 dark:text-green-400 border-green-500/30",
      Tamil:
        "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
    }
    return (
      colors[language as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
    )
  }

  // Add a helper for formatting daily/weekly labels
  function formatXAxisLabel(label: string, period: string) {
    if (period === 'daily') {
      const d = new Date(label);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      }
      return label;
    }
    if (period === 'weekly') {
      return label.replace('W', 'Wk ');
    }
    return label;
  }

  // Add a helper to calculate interval for XAxis
  function getXAxisInterval(dataLength: number) {
    if (dataLength <= 20) return 0;
    return Math.ceil(dataLength / 10); // Show about 10 labels
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "dark" : ""}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-rose-50 dark:from-gray-950 dark:via-violet-950/20 dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-violet-500/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Enhanced Top Navbar */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary animate-glow">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                    CineDash
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block font-medium">
                    Movie Warehouse Analytics • Real-time Insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="badge-premium hidden sm:flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Live Data</span>
              </Badge>
              <Badge className="badge-premium hidden md:flex items-center space-x-2">
                <BarChart3 className="h-3 w-3" />
                <span>Analytics</span>
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                {darkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-violet-600" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className={`kpi-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-responsive-xl font-bold text-foreground mb-1">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-semibold">+12.5%</span>
                </div>
                <span className="text-muted-foreground"></span>
              </div>
            </CardContent>
          </Card>

          <Card className={`kpi-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Tickets Sold</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-responsive-xl font-bold text-foreground mb-1">
                {formatNumber(ticketsSold)}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-semibold">+8.2%</span>
                </div>
                <span className="text-muted-foreground"></span>
              </div>
            </CardContent>
          </Card>

          <Card className={`kpi-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.3s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Top Location</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/20">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-responsive-xl font-bold text-foreground mb-1">{topRevenueLocation}</div>
              <Badge className="badge-premium text-xs px-2 py-0.5">
                <Sparkles className="h-2 w-2 mr-1" />
                Leading market
              </Badge>
            </CardContent>
          </Card>

          <Card className={`kpi-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.4s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Avg Ticket Price</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-responsive-xl font-bold text-foreground mb-1">
                {formatCurrency(avgTicketPrice)}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-semibold">+5.1%</span>
                </div>
                <span className="text-muted-foreground"></span>
              </div>
            </CardContent>
          </Card>

          <Card className={`kpi-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.5s" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Discounts</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20">
                <Percent className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-responsive-xl font-bold text-foreground mb-1">
                {formatCurrency(totalDiscounts)}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-muted-foreground">7.1% of revenue </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <Card className={`chart-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.6s" }}>
            <CardHeader className="pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold">Revenue Trend</h2>
                <div className="flex gap-2">
                  <Select value={selectedYear} onValueChange={v => setSelectedYear(v)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={period} onValueChange={v => setPeriod(v as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-violet-600" />
                    </div>
                    <span>Monthly Revenue Trend</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    Revenue trend by month for the current year
                  </CardDescription>
                </div>
                <Badge className="badge-premium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {growth > 0 ? `+${growth.toFixed(1)}% YoY` : `${growth.toFixed(1)}% YoY`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="min-h-[320px] max-h-[480px] h-[40vw] md:h-[420px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 32, right: 24, left: 24, bottom: 48 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="label"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        fontWeight={500}
                        angle={period === 'weekly' ? -15 : -35}
                        textAnchor="end"
                        height={period === 'weekly' ? 40 : 60}
                        interval={getXAxisInterval(chartData.length)}
                        tickFormatter={label => {
                          if (period === 'monthly') return label;
                          if (period === 'weekly') return label.replace('W', 'Wk ');
                          if (period === 'quarterly') return label;
                          return label;
                        }}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => {
                          if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`;
                          if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
                          return `₹${value}`;
                        }}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        fontWeight={500}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: "hsl(var(--chart-1))", strokeWidth: 2, fill: "white" }}
                        fill="url(#revenueGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Location */}
          <Card className={`chart-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.7s" }}>
            <CardHeader className="pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold">Revenue by Location</h2>
                <Select value={region} onValueChange={v => setRegion(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                      <PieChart className="h-4 w-4 text-rose-600" />
                    </div>
                    <span>Revenue by Location</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    Revenue by location for all time
                  </CardDescription>
                </div>
                <Badge className="badge-premium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {region === 'All' ? locationRevenueData.length : locationRevenueData.filter(l => cityRegionMap[l.location] === region).length} Locations
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="min-h-[320px] max-h-[480px] h-[40vw] md:h-[420px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={region === 'All' ? locationRevenueData : locationRevenueData.filter(l => cityRegionMap[l.location] === region)} margin={{ top: 32, right: 24, left: 24, bottom: 48 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="location" stroke="hsl(var(--muted-foreground))" fontSize={11} fontWeight={500} angle={-35} textAnchor="end" height={60} interval={getXAxisInterval(locationRevenueData.length)} />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => {
                          if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`;
                          if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
                          return `₹${value}`;
                        }}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        fontWeight={500}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Movies */}
          <Card className={`table-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.8s" }}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                      <Film className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Top 5 Movies</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    Movies JOIN Fact_Table, GROUP BY title, SUM(totalAmount)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="custom-scrollbar overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="font-bold text-foreground">Title</TableHead>
                      <TableHead className="font-bold text-foreground">Genre</TableHead>
                      <TableHead className="font-bold text-foreground">Language</TableHead>
                      <TableHead className="text-right font-bold text-foreground">Duration</TableHead>
                      <TableHead className="text-right font-bold text-foreground">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topMovies.map((movie, index) => (
                      <TableRow key={index} className="border-border/30 hover:bg-muted/30 transition-all duration-200">
                        <TableCell className="font-semibold text-foreground">{movie.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getGenreColor(movie.genre)} font-medium`}>
                            {movie.genre}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getLanguageColor(movie.language)} font-medium`}>
                            {movie.language}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{movie.duration}m</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          {formatCurrency(movie.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Theaters */}
          <Card className={`table-card ${isLoaded ? "animate-slide-up" : ""}`} style={{ animationDelay: "0.9s" }}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Top 5 Theaters</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2">
                    Theater JOIN Fact_Table, GROUP BY t_name, SUM(totalAmount)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="custom-scrollbar overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="font-bold text-foreground">Theater Name</TableHead>
                      <TableHead className="font-bold text-foreground">Location</TableHead>
                      <TableHead className="text-right font-bold text-foreground">Total Seats</TableHead>
                      <TableHead className="text-right font-bold text-foreground">Tickets Sold</TableHead>
                      <TableHead className="text-right font-bold text-foreground">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTheaters.map((theater, index) => (
                      <TableRow key={index} className="border-border/30 hover:bg-muted/30 transition-all duration-200">
                        <TableCell className="font-semibold text-foreground">{theater.t_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30 font-medium"
                          >
                            {theater.location}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30 font-medium"
                          >
                            {formatNumber(theater.totalSeats)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {formatNumber(theater.ticketsSold)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground">
                          {formatCurrency(theater.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
