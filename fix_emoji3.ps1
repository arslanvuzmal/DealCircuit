$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Find the exact problematic text and replace it
$content = $content -replace '<span className="text-xl">[\s\S]*?</span>', '<span className="text-xl">✍</span>'

# More aggressive: find the exact line with the problematic span and replace the whole line
$lines = $content -split "`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -like '*<span className="text-xl">*' -and $lines[$i] -like '*??*') {
        Write-Host "Found at line $($i+1): $($lines[$i])"
        $lines[$i] = '                  <span className="text-xl">✍</span>'
    }
}
$content = $lines -join "`n"

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Fixed emoji in intelligence page (line-based)"