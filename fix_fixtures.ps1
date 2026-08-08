$files = Get-ChildItem "C:\Users\laptopzone\Desktop\LeadPilot AI\fixtures\*.ts"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'security: \{', 'security: {\n    suspiciousPhrases: [],'
    Set-Content $file.FullName $content
}
Write-Host "Fixed all fixtures"