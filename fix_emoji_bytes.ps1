$bytes = [System.IO.File]::ReadAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx")

# The problematic bytes are at positions 33041-33046 (0xC3 0xA2 0xC5 0x93 0xC2 0x8D)
# These correspond to the corrupted "✍" emoji bytes
# Let's find and replace them directly at the byte level
for ($i = 33040; $i -le 33050 -and $i -lt $bytes.Length; $i++) {
    Write-Host ("Byte {0}: 0x{1:X2} char: {2}" -f $i, $bytes[$i], [char]$bytes[$i])
}

# Replace the corrupted bytes with the correct UTF-8 for "✍" (0xE2 0x9C 0x8D)
# The corrupted sequence is 6 bytes, we need to replace with 3 bytes
# But we need to be careful about array size
# Let's just replace the specific corrupted sequence
for ($i = 0; $i -lt $bytes.Length - 5; $i++) {
    if ($bytes[$i] -eq 0xC3 -and $bytes[$i+1] -eq 0xA2 -and $bytes[$i+2] -eq 0xC5 -and $bytes[$i+3] -eq 0x93 -and $bytes[$i+4] -eq 0xC2 -and $bytes[$i+5] -eq 0x8D) {
        Write-Host "Found corrupted sequence at index $i"
        # Replace 6 bytes with 3 bytes for the correct emoji
        $newBytes = [System.Collections.Generic.List[byte]]::new($bytes)
        $newBytes.RemoveRange($i, 6)
        $newBytes.InsertRange($i, @(0xE2, 0x9C, 0x8D)) # UTF-8 for ✍
        $bytes = $newBytes.ToArray()
        Write-Host "Replaced corrupted emoji at index $i"
        break
    }
}

[System.IO.File]::WriteAllBytes("C:\Users\laptopzone\Desktop\LeadPilot AI\app\intelligence\page.tsx", $bytes)
Write-Host "Fixed emoji at byte level"