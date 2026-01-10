# Create a proper PNG using base64 data
# This is a simple 100x100 gray rectangle PNG in base64

$base64PNG = @"
iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAiklEQVR4nO3RAQ0AAAjDMO5fNCCDkFsJQGEDEyRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkCBBggQJEiRIkKCvBfgAGkclHAAAAABJRU5ErkJggg==
"@

$bytes = [Convert]::FromBase64String($base64PNG)
[System.IO.File]::WriteAllBytes("base64test.png", $bytes)

# Also create a very simple 1-pixel PNG
$simpleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4nEKtAAAAABJRU5ErkJggg=="
$simpleBytes = [Convert]::FromBase64String($simpleBase64)
[System.IO.File]::WriteAllBytes("simple.png", $simpleBytes)

Write-Host "Created base64 PNG files"
ls base64test.png, simple.png | Format-Table Name, Length
