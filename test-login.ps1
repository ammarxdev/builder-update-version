$body = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Body $body -ContentType "application/json"

Write-Host "Login Test Result:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 5
