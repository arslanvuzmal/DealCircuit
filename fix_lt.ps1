$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Fix the <1 Month issue by replacing the problematic option
$content = $content -replace '<option><1 Month \(Immediate\)</option>', '<option><1 Month (Immediate)</option>'

# Also fix any other similar issues
$content = $content -replace '<option><1 Month \(Immediate\)</option>', '<option><1 Month (Immediate)</option>'

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Fixed <1 Month issue in intelligence page"