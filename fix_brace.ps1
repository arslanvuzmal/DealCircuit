$content = Get-Content "C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx" -Raw
$content = $content -replace ';\n  }\n}\n\nexport', ';\n  }\n\nexport'
Set-Content "C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx" $content
Write-Host "Fixed extra brace"