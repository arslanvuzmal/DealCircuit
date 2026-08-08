$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$content = $content.Substring(33030, 20)
Write-Host "Context around 33041: [$content]"
$bytes2 = $content.ToCharArray()
for ($i = 0; $i -lt $content2.Length; $i++) {
    Write-Host ("Char {0}: '{1}' (0x{2:X4})" -f $i, $content2[$i], [int]$content2[$i])
}