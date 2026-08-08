$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
Write-Host "First 4 bytes: $([string]::Join(' ', ($bytes[0..3] | ForEach-Object { '{0:X2}' -f $_ })))"
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "BOM detected!"
}