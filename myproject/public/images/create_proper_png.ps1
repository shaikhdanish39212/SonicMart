# Create a simple 1x1 pixel PNG in base64 and expand it
$base64PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4nEKtAAAAABJRU5ErkJggg=="
$bytes = [Convert]::FromBase64String($base64PNG)
[System.IO.File]::WriteAllBytes("simple.png", $bytes)

# Now create a proper PNG using .NET
Add-Type -AssemblyName System.Drawing

$width = 400
$height = 300
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Background
$bgColor = [System.Drawing.Color]::LightGray
$graphics.Clear($bgColor)

# Border
$borderColor = [System.Drawing.Color]::Gray
$pen = New-Object System.Drawing.Pen($borderColor, 2)
$graphics.DrawRectangle($pen, 10, 10, $width-20, $height-20)

# Text
$font = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$textColor = [System.Drawing.Color]::Black
$brush = New-Object System.Drawing.SolidBrush($textColor)
$graphics.DrawString("Product Image", $font, $brush, 120, 130)
$graphics.DrawString("Loading...", $font, $brush, 140, 160)

# Save as proper PNG
$bitmap.Save("placeholder.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()

# Copy to the required names
$requiredFiles = @(
    "Microphone1.png", "Microphone1.1.png", "Microphone1.2.png", "Microphone1.3.png",
    "DJSpeaker1.png", "DJSpeaker1.1.png", "DJSpeaker1.2.png", "DJSpeaker1.3.png",
    "HeadPhones1.png", "HeadPhones1.1.png", "HeadPhones1.2.png", "HeadPhones1.3.png",
    "GuitarsBasses1.png", "GuitarsBasses1.1.png", "GuitarsBasses1.2.png", "GuitarsBasses1.3.png"
)

foreach ($file in $requiredFiles) {
    Copy-Item "placeholder.png" $file -Force
    Write-Host "Created $file"
}

Write-Host "Created proper PNG files"
