$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

$content = $content -replace [char]0x2192, '->'
$content = $content -replace [char]0x270C, 'victory'
$content = $content -replace [char]0xFE0F, ''

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Cleaned remaining non-ASCII from intelligence page"