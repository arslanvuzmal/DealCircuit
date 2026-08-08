$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

# Find the problematic span and replace it entirely
$content = $content -replace '<span className="text-xl">\?o\?\uFFF0\?\uFFF0\?\uFFF0</span>', '<span className="text-xl">✍</span>'
$content = $content -replace '<span className="text-xl">\?o\?\ufff0\?\ufff0\?\ufff0</span>', '<span className="text-xl">✍</span>'
$content = $content -replace '<span className="text-xl">\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd</span>', '<span className="text-xl">✍</span>'
$content = $content -replace '<span className="text-xl">[^<]*</span>', '<span className="text-xl">✍</span>'

# More aggressive fix - replace the entire problematic span
$content = $content -replace '<span className="text-xl">[^<]*</span>', '<span className="text-xl">✍</span>'

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Fixed emoji in intelligence page"