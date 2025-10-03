# PowerShell script to test if both servers are running
Write-Host "🔍 Testing Server Status..." -ForegroundColor Yellow
Write-Host ""

# Test Backend API
Write-Host "Testing Backend API (https://localhost:7041)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://localhost:7041/api/appointments" -UseBasicParsing -TimeoutSec 5 2>$null
    Write-Host "✅ Backend API is responding!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend API is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test Frontend
Write-Host "Testing Frontend (http://localhost:4200)..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 5 2>$null
    Write-Host "✅ Frontend is responding!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Check processes
Write-Host "Checking running processes..." -ForegroundColor Cyan
$dotnetProcesses = Get-Process | Where-Object {$_.ProcessName -like "*dotnet*" -or $_.ProcessName -like "*AppointmentManagement*"}
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"}

if ($dotnetProcesses) {
    Write-Host "✅ .NET processes found:" -ForegroundColor Green
    $dotnetProcesses | ForEach-Object { Write-Host "   - $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray }
} else {
    Write-Host "❌ No .NET processes found" -ForegroundColor Red
}

if ($nodeProcesses) {
    Write-Host "✅ Node.js processes found:" -ForegroundColor Green
    $nodeProcesses | ForEach-Object { Write-Host "   - $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray }
} else {
    Write-Host "❌ No Node.js processes found" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 If servers are not running, use these commands:" -ForegroundColor Yellow
Write-Host "   Backend: cd backend && dotnet run" -ForegroundColor White
Write-Host "   Frontend: cd frontend && npx ng serve" -ForegroundColor White
