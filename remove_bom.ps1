$bytes = [System.IO.File]::ReadAllBytes("app\intelligence\page.tsx")
if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    [System.IO.File]::WriteAllBytes("app\intelligence\page.tsx", $bytes[3..($bytes.Length-1)])
    Write-Host "BOM removed from app\intelligence\page.tsx"
}
$bytes2 = [System.IO.File]::ReadAllBytes("app\submit\page.tsx")
if ($bytes2[0] -eq 0xEF -and $bytes2[1] -eq 0xBB -and $bytes2[2] -eq 0xBF) {
    [System.IO.File]::WriteAllBytes("app\submit\page.tsx", $bytes2[3..($bytes2.Length-1)])
    Write-Host "BOM removed from app\submit\page.tsx"
}