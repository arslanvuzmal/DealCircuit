$files = Get-ChildItem "C:\Users\laptopzone\Desktop\LeadPilot AI\fixtures\*.ts"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Fix literal \n sequences
    $content = $content -replace '\\n', "`n"
    Set-Content $file.FullName $content
}
Write-Host "Fixed literal newlines in all fixtures"