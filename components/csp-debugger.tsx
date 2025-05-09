"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CSPDebugger() {
  const [violations, setViolations] = useState<any[]>([])
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if (!isEnabled) return

    const handleViolation = (e: SecurityPolicyViolationEvent) => {
      setViolations((prev) => [
        ...prev,
        {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy,
          timestamp: new Date().toISOString(),
          sample: e.sample,
        },
      ])
    }

    document.addEventListener("securitypolicyviolation", handleViolation)
    return () => {
      document.removeEventListener("securitypolicyviolation", handleViolation)
    }
  }, [isEnabled])

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Content Security Policy Debugger</CardTitle>
        <CardDescription>This tool helps identify CSP violations in real-time</CardDescription>
        <Button onClick={() => setIsEnabled(!isEnabled)} variant={isEnabled ? "destructive" : "default"}>
          {isEnabled ? "Disable Monitoring" : "Enable Monitoring"}
        </Button>
      </CardHeader>
      <CardContent>
        {violations.length === 0 && isEnabled ? (
          <p className="text-muted-foreground">
            No CSP violations detected yet. Interact with the page to trigger potential violations.
          </p>
        ) : !isEnabled ? (
          <p className="text-muted-foreground">Enable monitoring to detect CSP violations.</p>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Detected Violations ({violations.length})</h3>
            <div className="max-h-96 overflow-auto">
              {violations.map((v, i) => (
                <div key={i} className="p-4 border rounded-md mb-2 bg-muted/30">
                  <p>
                    <strong>Time:</strong> {v.timestamp}
                  </p>
                  <p>
                    <strong>Blocked URI:</strong> {v.blockedURI}
                  </p>
                  <p>
                    <strong>Violated Directive:</strong> {v.violatedDirective}
                  </p>
                  <p>
                    <strong>Sample:</strong> {v.sample || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
