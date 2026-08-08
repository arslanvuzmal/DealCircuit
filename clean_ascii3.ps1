$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

$replacements = @{
    [char]0x2014 = '--'
    [char]0x2013 = '-'
    [char]0x2018 = "'"
    [char]0x2019 = "'"
    [char]0x201C = '"'
    [char]0x201D = '"'
    [char]0x2026 = '...'
    [char]0x2022 = '*'
    [char]0x201E = '"'
    [char]0x201A = ','
    [char]0x2039 = '<'
    [char]0x203A = '>'
    [char]0x00A0 = ' '
    [char]0x2010 = '-'
    [char]0x2011 = '-'
    [char]0x2012 = '-'
    [char]0x2212 = '-'
    [char]0x20AC = 'EUR'
    [char]0x00A3 = 'GBP'
    [char]0x00A5 = 'JPY'
    [char]0x00AE = '(R)'
    [char]0x00A9 = '(c)'
    [char]0x2122 = '(TM)'
    [char]0x00A7 = '§'
    [char]0x00B6 = '¶'
    [char]0x221E = 'infinity'
    [char]0x2015 = '---'
    [char]0x2016 = '||'
    [char]0x2017 = '__'
    [char]0x203B = '※'
    [char]0x203C = '!!'
    [char]0x203D = '?'
    [char]0x203E = '‾'
    [char]0x203F = '⁀'
    [char]0x2040 = '⁁'
    [char]0x2041 = '⁂'
    [char]0x2042 = '⁃'
    [char]0x2043 = '⁄'
    [char]0x2044 = '/'
    [char]0x2045 = '['
    [char]0x2046 = ']'
    [char]0x204E = '*'
    [char]0x204F = '⁏'
    [char]0x2050 = '⁐'
    [char]0x2051 = '⁑'
    [char]0x2052 = '⁒'
    [char]0x2053 = '⁓'
    [char]0x2054 = '⁔'
    [char]0x2055 = '⁕'
    [char]0x2056 = '⁖'
    [char]0x2058 = '⁘'
    [char]0x2059 = '⁙'
    [char]0x205A = '⁚'
    [char]0x205B = '⁛'
    [char]0x205C = '⁜'
    [char]0x205D = '⁝'
    [char]0x205E = '⁞'
    [char]0x2060 = ''
    [char]0x2061 = ''
    [char]0x2062 = ''
    [char]0x2063 = ''
    [char]0x2066 = ''
    [char]0x2067 = ''
    [char]0x2068 = ''
    [char]0x2069 = ''
    [char]0x206A = ''
    [char]0x206B = ''
    [char]0x206C = ''
    [char]0x206D = ''
    [char]0x206E = ''
    [char]0x206F = ''
    [char]0xFEFF = ''
    [char]0xFFFE = ''
    [char]0xFFFF = ''
}

foreach ($kvp in $replacements.GetEnumerator()) {
    $content = $content -replace [regex]::Escape($kvp.Key), $kvp.Value
}

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content))
Write-Host "Cleaned intelligence page"

$bytes2 = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx")
$content2 = [System.Text.Encoding]::UTF8.GetString($bytes2)

$replacements2 = @{
    [char]0x2014 = '--'
    [char]0x2013 = '-'
    [char]0x2018 = "'"
    [char]0x2019 = "'"
    [char]0x201C = '"'
    [char]0x201D = '"'
    [char]0x2026 = '...'
    [char]0x2022 = '*'
    [char]0x201E = '"'
    [char]0x201A = ','
    [char]0x2039 = '<'
    [char]0x203A = '>'
    [char]0x00A0 = ' '
    [char]0x2010 = '-'
    [char]0x2011 = '-'
    [char]0x2012 = '-'
    [char]0x2212 = '-'
    [char]0x20AC = 'EUR'
    [char]0x00A3 = 'GBP'
    [char]0x00A5 = 'JPY'
    [char]0x00AE = '(R)'
    [char]0x00A9 = '(c)'
    [char]0x2122 = '(TM)'
    [char]0x00A7 = '§'
    [char]0x00B6 = '¶'
    [char]0x20AC = 'EUR'
    [char]0x00A7 = '§'
    [char]0x00B6 = '¶'
    [char]0xFEFF = ''
    [char]0xFFFE = ''
    [char]0xFFFF = ''
}

foreach ($kvp in $replacements2.GetEnumerator()) {
    $content2 = $content2 -replace [regex]::Escape($kvp.Key), $kvp.Value
}

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\submit\page.tsx", [System.Text.Encoding]::UTF8.GetBytes($content2))
Write-Host "Cleaned submit page"