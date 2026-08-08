$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$content = $content -replace [char]0xFEFF, ''
[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "BOM removed from intelligence page"

$bytes2 = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx")
$content2 = [System.Text.Encoding]::UTF8.GetString($bytes2)
$content2 = $content2 -replace [char]0xFEFF, ''
[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content2))
Write-Host "BOM removed from submit page"