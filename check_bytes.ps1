$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$idx = $text.LastIndexOf("export default")
Write-Host "Before export (bytes):"
$substring = $text.Substring($idx - 80, 80)
for ($i = 0; $i -lt $substring.Length; $i++) {
    $c = $substring[$i]
    $b = [int]$c
    Write-Host ("{0}: '{1}' ({2})" -f $i, $c, $b)
}