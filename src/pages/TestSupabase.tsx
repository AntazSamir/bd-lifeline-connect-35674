import { useState, useEffect } from 'react'
import { useBloodRequests } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TestSupabase = () => {
  const { requests, loading, error, fetchRequests, addRequest } = useBloodRequests()
  const [testData, setTestData] = useState({
    blood_group: 'O+',
    location: 'Dhaka',
    units_needed: 2,
    urgency: 'urgent' as 'immediate' | 'urgent' | 'flexible',
    patient_info: 'Test patient',
    contact_number: '+8801712345678'
  })

  const handleTestSubmit = async () => {
    try {
      await addRequest(testData)
      console.log('Test request added successfully')
      // Refresh the requests list
      fetchRequests()
    } catch (err) {
      console.error('Error adding test request:', err)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Blood Request Submission</h2>
            <Button onClick={handleTestSubmit}>Add Test Request</Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Current Blood Requests</h2>
            {loading ? (
              <p>Loading requests...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border p-4 rounded">
                    <p><strong>ID:</strong> {request.id}</p>
                    <p><strong>Blood Group:</strong> {request.blood_group}</p>
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Units Needed:</strong> {request.units_needed}</p>
                    <p><strong>Urgency:</strong> {request.urgency}</p>
                    <p><strong>Patient Info:</strong> {request.patient_info}</p>
                    <p><strong>Contact:</strong> {request.contact_number}</p>
                  </div>
                ))}
                {requests.length === 0 && <p>No blood requests found.</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestSupabase