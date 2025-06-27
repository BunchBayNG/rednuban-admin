// components/dashboard/TopMerchants.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { topMerchants } from '@/lib/MockData';

export function TopMerchants() {
  return (
    <Card className='rounded-none'>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          Top Merchants By Payouts
          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topMerchants.map((merchant) => (
          <div key={merchant.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={merchant.avatar} alt={merchant.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  {merchant.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{merchant.name}</div>
                <div className="text-xs text-muted-foreground">{merchant.email}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-right">
              {merchant.amount}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}