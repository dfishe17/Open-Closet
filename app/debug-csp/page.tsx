"use client"

import { CSPDebugger } from "@/components/csp-debugger"

export default function DebugCSPPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">CSP Debugging Page</h1>
      <p className="mb-8">
        This page helps identify Content Security Policy violations. Enable the monitoring below and navigate through
        the site to detect issues.
      </p>

      <CSPDebugger />

      <div className="mt-8 p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-4">Test Area</h2>
        <p>Interact with elements below to test for CSP violations:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Dynamic Script Test</h3>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                // This might trigger a CSP violation
                const script = document.createElement("script")
                script.textContent = 'console.log("Dynamic script executed")'
                document.body.appendChild(script)
              }}
            >
              Insert Dynamic Script
            </button>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Eval Test</h3>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                try {
                  // This will trigger a CSP violation if 'unsafe-eval' is not allowed
                  eval('console.log("Eval executed")')
                } catch (e) {
                  console.error("Eval failed:", e)
                }
              }}
            >
              Test Eval
            </button>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">External Resource Test</h3>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                const img = document.createElement("img")
                img.src = "https://example.com/image.jpg"
                document.body.appendChild(img)
              }}
            >
              Load External Image
            </button>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Inline Style Test</h3>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => {
                const div = document.createElement("div")
                div.style.cssText = "background-color: red; padding: 20px; margin: 10px;"
                div.textContent = "Inline styled element"
                document.body.appendChild(div)
              }}
            >
              Add Inline Styled Element
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
