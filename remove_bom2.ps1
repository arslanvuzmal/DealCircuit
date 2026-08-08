$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $newBytes = $bytes[3..($bytes.Length-1)]
    [System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", $newBytes)
    Write-Host "BOM removed from intelligence page"
}
$bytes2 = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx")
if ($bytes2[0] -eq 0xEF -and $bytes2[1] -eq 0xBB -and $bytes2[2] -eq 0xBF) {
    $newBytes2 = $bytes2[3..($bytes2.Length-1)]
    [System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx", $newBytes2)
    Write-Host "BOM removed from submit page"
}