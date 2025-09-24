Write-Host "Cleaning up Docker..." -ForegroundColor Green
docker-compose down -v
docker system prune -f

Write-Host "Cleaning up project files..." -ForegroundColor Green
Remove-Item -Recurse -Force apps/server/dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/server/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force generated -ErrorAction SilentlyContinue

Write-Host "Cleanup complete!" -ForegroundColor Green