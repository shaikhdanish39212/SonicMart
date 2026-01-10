# PowerShell script to create PNG placeholders
param($CategoryName = "Product")

Add-Type -AssemblyName System.Drawing

function Create-PlaceholderPNG {
    param($FileName, $Category)
    
    $width = 400
    $height = 300
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Background
    $bgColor = [System.Drawing.Color]::FromArgb(248, 250, 252)
    $graphics.Clear($bgColor)
    
    # Border
    $borderColor = [System.Drawing.Color]::FromArgb(226, 232, 240)
    $pen = New-Object System.Drawing.Pen($borderColor, 2)
    $graphics.DrawRectangle($pen, 20, 20, 360, 260)
    
    # Text
    $font = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    $textColor = [System.Drawing.Color]::FromArgb(100, 116, 139)
    $brush = New-Object System.Drawing.SolidBrush($textColor)
    
    $text1 = $Category -replace "_", " "
    $text2 = "Product Image"
    
    $graphics.DrawString($text1, $font, $brush, 150, 130)
    $graphics.DrawString($text2, $font, $brush, 150, 150)
    
    # Icon placeholder
    $iconColor = [System.Drawing.Color]::FromArgb(203, 213, 225)
    $iconBrush = New-Object System.Drawing.SolidBrush($iconColor)
    $graphics.FillEllipse($iconBrush, 185, 180, 30, 30)
    
    # Save
    $bitmap.Save($FileName, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Create key images the backend is looking for
$images = @(
    @{name="Microphone1.png"; category="Microphone"}
    @{name="Microphone1.1.png"; category="Microphone"}
    @{name="Microphone1.2.png"; category="Microphone"}
    @{name="Microphone1.3.png"; category="Microphone"}
)

foreach ($img in $images) {
    Create-PlaceholderPNG -FileName $img.name -Category $img.category
    Write-Host "Created $($img.name)"
}
