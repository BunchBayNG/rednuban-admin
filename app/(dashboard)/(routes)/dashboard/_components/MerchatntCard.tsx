// components/dashboard/MerchantsChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  ReferenceDot
} from 'recharts';
import { merchantsChartData } from '@/lib/MockData';

export function MerchantsChart() {
  const highlightedPoint = merchantsChartData.find(point => point.month === 'May');
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Merchants vNUBAN Summary
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">1D</Badge>
            <Badge variant="outline" className="text-xs">1W</Badge>
            <Badge variant="outline" className="text-xs">1M</Badge>
            <Badge variant="default" className="text-xs">1Y</Badge>
            <Badge variant="outline" className="text-xs">Max</Badge>
          </div>
        </div>
        <div className="text-xl font-medium">108,400</div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merchantsChartData}>
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
                formatter={(value: number) => [value.toLocaleString(), 'Merchants']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#dc2626' }}
              />
              {highlightedPoint && (
                <ReferenceDot 
                  x="May" 
                  y={highlightedPoint.value} 
                  r={4}
                  fill="#dc2626"
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
    
      </CardContent>
    </Card>
  );
}