$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$lines = $content -split "`n"
for ($i = 555; $i -lt 570 -and $i -lt $lines.Count; $i++) {
    Write-Host ("{0}: {1}" -f ($i+1), $lines[$i])
}