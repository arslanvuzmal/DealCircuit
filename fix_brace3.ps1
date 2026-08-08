$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
# Fix the extra brace - replace ";\r\n  }\r\n}\r\n\r\nexport" with ";\r\n  }\r\n\r\nexport"
$text = $text -replace ";\r\n  }\r\n}\r\n\r\nexport", ";\r\n  }\r\n\r\nexport"
[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($text))
Write-Host "Fixed"