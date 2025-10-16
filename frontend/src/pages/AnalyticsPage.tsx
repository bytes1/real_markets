import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, TrendingUp, BookOpen } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// --- Mock Data (replace with your actual data fetching logic) ---
const totalVolume = 1250345.78;
const totalMarkets = 152;
const activeUsers = 2350;

const volumeData = [
  { date: "Jan", volume: 4000 },
  { date: "Feb", volume: 3000 },
  { date: "Mar", volume: 5000 },
  { date: "Apr", volume: 4500 },
  { date: "May", volume: 6000 },
  { date: "Jun", volume: 5500 },
];

const usersData = [
  { date: "Jan", users: 1200 },
  { date: "Feb", users: 1500 },
  { date: "Mar", users: 1400 },
  { date: "Apr", users: 1800 },
  { date: "May", users: 2100 },
  { date: "Jun", users: 2350 },
];

const topMarkets = [
  {
    question: "Will ETH reach $5,000 by end of year?",
    volume: 250000,
    participants: 450,
    status: "Active",
  },
  {
    question: "Will the next US president be from the Republican party?",
    volume: 180000,
    participants: 620,
    status: "Active",
  },
  {
    question:
      "Will a new AI model with over 10T parameters be announced in Q4?",
    volume: 120000,
    participants: 310,
    status: "Resolved",
  },
];

// --- Component ---
export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* You can add more tabs here later, e.g., for user-specific analytics */}
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trading Volume
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {totalVolume.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{activeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Markets Created
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalMarkets}</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platform Growth
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  New users this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
                <CardDescription>
                  Total volume traded per month.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>New user sign-ups per month.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={usersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Markets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Markets</CardTitle>
              <CardDescription>
                The most popular markets by trading volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Market</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topMarkets.map((market) => (
                    <TableRow key={market.question}>
                      <TableCell>
                        <div className="font-medium">{market.question}</div>
                      </TableCell>
                      <TableCell>{market.status}</TableCell>
                      <TableCell className="text-right">
                        {market.participants}
                      </TableCell>
                      <TableCell className="text-right">
                        ${market.volume.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
