// components/dashboard/TransactionFlowChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { transactionFlowData } from '@/lib/MockData';

export function TransactionFlowChart() {
  // const highlightedPoint = transactionFlowData.find(point => point.month === 'Jun');
  
  return (
    <Card className=''>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Merchants Total Transaction Flow
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">1D</Badge>
            <Badge variant="outline" className="text-xs">1W</Badge>
            <Badge variant="outline" className="text-xs">1M</Badge>
            <Badge variant="default" className="text-xs">1Y</Badge>
            <Badge variant="outline" className="text-xs">Max</Badge>
          </div>
        </div>
        <div className="text-xl font-medium">10,000</div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactionFlowData} barCategoryGap="20%">
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Transactions']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#dc2626"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
     
      </CardContent>
    </Card>
  );
}