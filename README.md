
# 🎥 CineDash – Movie Data Warehouse Analytics

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Visualization-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

</div>

> 🌟 Real-time business intelligence for cinema chains. Track revenue, attendance, and performance with a powerful Star Schema backend.

## 📚 Overview

**CineDash** is a modern Business Intelligence (BI) dashboard designed to visualize data from a **Movie Data Warehouse**. Built with **Next.js 15** and **PostgreSQL**, it leverages a **Star Schema** architecture to track critical metrics like ticket sales, revenue, and theater performance. The platform combines a polished, glassmorphic UI with interactive charts to provide actionable insights for cinema management.

It sounds like you want a cleaner, more structured layout that groups the features logically so it's easier to scan.

Here is a reorganized **Features** section using a **2-column grid layout**. This categorizes the features into functional areas (Financial, Geographic, Content, and UX) to make the business value clear.

You can copy and replace the existing `## ✨ Key Features` section in your `README.md` with this block:

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 📊 Financial & Sales Intelligence

> *Track the financial pulse of your cinema chain.*

* 💰 **Real-time Revenue Engine:** Instant aggregation of total earnings across all properties.
* 🎟️ **Ticket Economics:** Monitor sales volume, Average Ticket Price (ATP), and discount rates.
* 📉 **Multi-Period Growth:** Toggle trends between **Monthly**, **Weekly**, and **Quarterly** views.
* 🎯 **YoY Performance:** Automatic Year-over-Year growth calculation with status indicators.

### 🗺️ Geographic & Theater Analytics

> *Optimize operations across regions and venues.*

* 🌍 **Zonal Analysis:** Filter revenue by North, South, East, West, and Central regions.
* 🏢 **Theater Leaderboard:** Rank top-performing cinemas by footfall and revenue.
* 📍 **Location Heatmaps:** Identify high-growth cities and underperforming markets.
* 💺 **Capacity Metrics:** Track total seats available vs. tickets sold per venue.

</td>
<td width="50%">

### 🎬 Content Strategy Insights

> *Understand what movies drive your revenue.*

* 🏆 **Blockbuster Tracking:** Top 5 Movies ranked by box office collection.
* 🎭 **Genre Performance:** Visual breakdown of Action, Drama, Comedy, and Romance performance.
* 🗣️ **Language Demographics:** Compare revenue share across Hindi, English, and regional languages.
* ⏱️ **Runtime Correlation:** Analyze the impact of movie duration on ticket sales.

### ⚡ Interactive UX & Technology

> *A premium, responsive analytic experience.*

* 🔍 **Dynamic Filtering:** Slice data by specific **Years** or **Geographic Regions** instantly.
* 🌓 **Smart Theming:** System-aware Dark/Light mode with persisted preferences.
* 💎 **Glassmorphic UI:** Modern aesthetic with animated backgrounds and translucent cards.
* 📱 **Adaptive Layout:** Fully responsive grid that adjusts from desktop to mobile views.

</td>
</tr>
</table>

## 🛠️ Tech Stack

<details>
<summary><b>🔷 Frontend Technologies</b></summary>

- ⚛️ **React 18** – Component-based UI logic
- ⚡ **Next.js 15** – App Router and Server Components
- 🎨 **Tailwind CSS 3** – Utility-first styling
- 📊 **Recharts** – Composable charting library
- 🧩 **Shadcn/UI** – Accessible component primitives
- 🎭 **Lucide React** – Beautiful icon set
- 📅 **Date-fns** – Date manipulation and formatting

</details>

<details>
<summary><b>🔷 Backend & Database</b></summary>

- 🟢 **Node.js** – Server-side runtime
- 🐘 **PostgreSQL** – Relational database system
- 🏗️ **Star Schema** – Optimized data warehouse design (Fact/Dimensions)
- 🔌 **pg (node-postgres)** – PostgreSQL client for Node.js
- 🔺 **Prisma** – ORM for schema definition

</details>

## 📁 Project Structure

```ascii
Movie_Datawarehouse/
├── 📱 app/                         # Next.js App Router
│   ├── 📄 page.tsx                 # Main Dashboard logic & visualization
│   ├── 📄 layout.tsx               # Root layout with fonts & providers
│   ├── 📄 globals.css              # Global styles & Tailwind directives
│   └── 🔌 api/                     # Backend API Routes
│       ├── customers/route.ts      # Customer dimension endpoints
│       ├── facts/route.ts          # Fact Table endpoints
│       ├── movies/route.ts         # Movie dimension endpoints
│       └── ...
│
├── 🧱 components/                  # UI Components
│   ├── 🧩 ui/                      # Shadcn/UI primitives (Card, Button, etc.)
│   └── 🌓 theme-provider.tsx       # Next-themes provider
│
├── 📚 lib/                         # Utilities
│   ├── 🗄️ db.ts                    # PostgreSQL connection pool
│   └── 🛠️ utils.ts                 # Helper functions (clsx, twMerge)
│
├── 🗃️ prisma/                      # Database Configuration
│   └── 📄 schema.prisma            # Star Schema definition
│
└── 📦 public/                      # Static Assets

```

## 🏗️ Architecture & Data Modeling

### 🌟 Star Schema Design

The application is built on a robust **Data Warehouse** foundation using a Star Schema:

* **Fact_Table**: The central table containing metrics (`ticketSold`, `totalAmount`, `discount`) and foreign keys.
* **Dimensions**:
* `Movies`: Title, genre, rating, duration.
* `Theater`: Location, capacity, show times.
* `Customer`: Demographics and contact info.
* `Date`: Temporal dimension for time-series analysis.



### 🔄 Data Flow

```ascii
[ PostgreSQL DB ]  <--Query-->  [ Next.js API Routes ]  <--JSON-->  [ React Client ]
      |                                   |                                |
(Star Schema)                      (Raw Data Fetch)                 (Aggregation)
      |                                   |                                |
Fact & Dimensions                 SELECT * FROM ...              Compute KPIs & Joins
                                                                   Render Charts

```

## 🚀 Getting Started

### ⚙️ Prerequisites

* 💻 Node.js (v18 or higher)
* 🐘 PostgreSQL Database
* 📦 npm or pnpm

### 🛠️ Installation

```bash
# Clone the repository
git clone [https://github.com/Yashparmar1125/movie_datawarehouse.git](https://github.com/Yashparmar1125/movie_datawarehouse.git)

# Navigate to project
cd movie_datawarehouse

# Install dependencies
npm install

# Configure environment
# Create .env file with your Database URL (see below)

# Run migrations (if using Prisma for setup)
npx prisma db push

# Start development server
npm run dev

```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Connection string for your PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/movie_dw?schema=public"

```

## 📝 API Routes

| Route Endpoint | Description |
| --- | --- |
| 📊 `/api/facts` | Retrieves the main Fact Table data (sales, revenue) |
| 🎬 `/api/movies` | Fetches Movie dimension data (titles, genres) |
| 📍 `/api/theaters` | Fetches Theater dimension data (locations, seats) |
| 📅 `/api/dates` | Fetches Date dimension for time-series logic |
| 👥 `/api/customers` | Fetches Customer dimension data |

## 🎨 UI/UX Highlights

### 📊 Dashboard Experience

The dashboard acts as a Single Page Application (SPA) that loads data on mount and performs client-side aggregation for instant interactivity.

* **KPI Cards**: Immediate view of critical business metrics.
* **Dynamic Charts**: Toggle between Monthly, Weekly, and Quarterly views without page reloads.
* **Smart Filtering**: Select specific years or regions to slice and dice the data.

### 🐛 Common Issues & Troubleshooting

1. **BigInt Serialization**:
* *Issue:* "Do not know how to serialize a BigInt".
* *Solution:* The app handles this by converting BigInts to strings/numbers on the client side before rendering.


2. **Database Connection**:
* Ensure your `DATABASE_URL` is correct in `.env`.
* Check if the PostgreSQL service is running.



## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m "Add some AmazingFeature"`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Yash Parmar**

* 🌐 [GitHub](https://github.com/Yashparmar1125)
* 💼 [LinkedIn](https://linkedin.com/in/yashparmar1125)
* 📧 [Email](mailto:yashparmar11y@gmail.com)

---

<div align="center">

### 🌟 Star this repo if you find it helpful! 🌟

**Built with ❤️ using Next.js, PostgreSQL, and Tailwind CSS**

</div>

```

```
