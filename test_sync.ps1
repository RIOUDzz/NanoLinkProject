$goServer = "http://localhost:4002/"
$nodeServer = "http://localhost:4001/api/shorten"

Write-Host "Waiting for Go server to start..."
for ($i=0; $i -lt 180; $i++) {
    try {
        $response = Invoke-WebRequest -Uri $goServer -Method Get -ErrorAction Stop
    } catch {
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            Write-Host "Server is UP!"
            break
        }
    }
    Start-Sleep -Seconds 2
}

Write-Host "Sending POST to Node server to shorten https://netflix.com..."
$nodeResponse = Invoke-RestMethod -Method Post -Uri $nodeServer -Headers @{"Content-Type"="application/json"} -Body '{"url": "https://netflix.com"}' 
$shortCode = $nodeResponse.shortCode

Write-Host "Generated Shortcode: $shortCode"
Write-Host "Testing ultra-fast local redirect at Go server..."

try {
    $redirectResponse = Invoke-WebRequest -Uri "http://localhost:4002/$shortCode" -MaximumRedirection 0 -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 302 -or $_.Exception.Response.StatusCode -eq 303) {
        Write-Host "SUCCESS! Go Server responded with 302 Redirect to:"
        Write-Host $_.Exception.Response.Headers.Location
    } else {
        Write-Host "Failed to receive correct redirect."
        Write-Host $_.Exception.Message
    }
}
