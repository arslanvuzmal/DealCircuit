$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx")
$bytes[0..3] | ForEach-Object { '{0:X2} ' -f $_ }