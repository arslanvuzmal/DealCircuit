$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$idx = $text.LastIndexOf("export default")
Write-Host "Before export:"
Write-Host $text.Substring($idx - 50, 50)