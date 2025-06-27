import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import AccountPage from './_components/AccountPage'

function SettingsPage() {
  return (
    <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className='mb-6'>
     <p> Settings</p>
     </div>
     <Card>
        <CardContent>
          <AccountPage />
        </CardContent>
      </Card>

      </div>
  )
}

export default SettingsPage