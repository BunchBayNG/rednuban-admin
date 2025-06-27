// components/dashboard/PayoutStatusChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer
} from 'recharts';
import { payoutData, payoutStats } from '@/lib/MockData';

const COLORS = {
  success: '#22c55e',
  failure: '#ef4444'
};

const chartData = [
  { 
    name: 'Success', 
    value: payoutData.succeeded, 
    percentage: payoutStats.successRate,
    color: COLORS.success
  },
  { 
    name: 'Failure', 
    value: payoutData.failed, 
    percentage: payoutStats.failureRate,
    color: COLORS.failure
  }
];

export function PayoutStatusChart() {
  return (
    <Card className='rounded-none'>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Payout Status Rate (Success vs Failures)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-8">
          {/* Chart */}
          <div className="relative h-32 w-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">{payoutStats.total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Success Rate</span>
              </div>
              <span className="text-sm ">{payoutStats.successRate}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Failure Rate</span>
              </div>
              <span className="text-sm ">{payoutStats.failureRate}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}