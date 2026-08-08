$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

$content = $content -replace [char]0x201C, '"'
$content = $content -replace [char]0x201D, '"'
$content = $content -replace [char]0x2018, "'"
$content = $content -replace [char]0x2019, "'"
$content = $content -replace [char]0x201C, '"'
$content = $content -replace [char]0x201D, '"'
$content = $content -replace [char]0x2026, '...'
$content = $content -replace [char]0x2013, '-'
$content = $content -replace [char]0x2014, '--'
$content = $content -replace [char]0x2026, '...'
$content = $content -replace [char]0x2022, '*'
$content = $content -replace [char]0x201E, '"'
$content = $content -replace [char]0x201A, ','
$content = $content -replace [char]0x2039, '<'
$content = $content -replace [char]0x203A, '>'
$content = $content -replace [char]0x00A0, ' '
$content = $content -replace [char]0x2010, '-'
$content = $content -replace [char]0x2011, '-'
$content = $content -replace [char]0x2012, '-'
$content = $content -replace [char]0x2212, '-'
$content = $content -replace [char]0x20AC, 'EUR'
$content = $content -replace [char]0x00A3, 'GBP'
$content = $content -replace [char]0x00A5, 'JPY'
$content = $content -replace [char]0x00AE, '(R)'
$content = $content -replace [char]0x00A9, '(c)'
$content = $content -replace [char]0x2122, '(TM)'
$content = $content -replace [char]0x00A7, '§'
$content = $content -replace [char]0x00B6, '¶'
$content = $content -replace [char]0x20AC, 'EUR'
$content = $content -replace [char]0x00A7, '§'
$content = $content -replace [char]0x00B6, '¶'
$content = $content -replace [char]0xFEFF, ''
$content = $content -replace [char]0xFFFE, ''
$content = $content -replace [char]0xFFFF, ''

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Cleaned intelligence page"

$bytes2 = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx")
$content2 = [System.Text.Encoding]::UTF8.GetString($bytes2)

$content2 = $content2 -replace [char]0x2014, '--'
$content2 = $content2 -replace [char]0x2013, '-'
$content2 = $content2 -replace [char]0x2018, "'"
$content2 = $content2 -replace [char]0x2019, "'"
$content2 = $content2 -replace [char]0x201C, '"'
$content2 = $content2 -replace [char]0x201D, '"'
$content2 = $content2 -replace [char]0x2026, '...'
$content2 = $content2 -replace [char]0x2022, '*'
$content2 = $content2 -replace [char]0x201E, '"'
$content2 = $content2 -replace [char]0x201A, ','
$content2 = $content2 -replace [char]0x2039, '<'
$content2 = $content2 -replace [char]0x203A, '>'
$content2 = $content2 -replace [char]0x00A0, ' '
$content2 = $content2 -replace [char]0x2010, '-'
$content2 = $content2 -replace [char]0x2011, '-'
$content2 = $content2 -replace [char]0x2012, '-'
$content2 = $content2 -replace [char]0x2212, '-'
$content2 = $content2 -replace [char]0x20AC, 'EUR'
$content2 = $content2 -replace [char]0x00A3, 'GBP'
$content2 = $content2 -replace [char]0x00A5, 'JPY'
$content2 = $content2 -replace [char]0x00AE, '(R)'
$content2 = $content2 -replace [char]0x00A9, '(c)'
$content2 = $content2 -replace [char]0x2122, '(TM)'
$content2 = $content2 -replace [char]0x00A7, '§'
$content2 = $content2 -replace [char]0x00B6, '¶'
$content2 = $content2 -replace [char]0x20AC, 'EUR'
$content2 = $content2 -replace [char]0x00A7, '§'
$content2 = $content2 -replace [char]0x00B6, '¶'
$content2 = $content2 -replace [char]0xFEFF, ''
$content2 = $content2 -replace [char]0xFFFE, ''
$content2 = $content2 -replace [char]0xFFFF, ''

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content2))
Write-Host "Cleaned submit page"