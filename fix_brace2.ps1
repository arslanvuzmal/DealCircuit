$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
# Remove the extra closing brace
$text = $text -replace ";\n  }\n}\n}\n\nexport", ";\n  }\n}\n\nexport"
[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($text))
Write-Host "Fixed"