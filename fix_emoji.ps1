$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Fix the emoji in the "Enter Your Own Lead" button
$content = $content -replace '<span className="text-xl">\?o\?\uFFF0\?\uFFF0\?\uFFF0</span>', '<span className="text-xl">✍️</span>'

# Also fix any other similar issues
$content = $content -replace '\uD83D\uDD8E', '✍️'
$content = $content -replace '\u270D', '✍️'
$content = $content -replace '\uFE0F', ''

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Fixed emoji characters in intelligence page"