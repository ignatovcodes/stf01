# Сжатие PNG в images/ — ресайз до 800px по большей стороне (без Node.js)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $PSScriptRoot "..\images"
$maxSide = 600
$files = Get-ChildItem -Path $imagesDir -Filter "*.png" -File
if ($files.Count -eq 0) { Write-Host "В images нет PNG."; exit 0 }

$totalBefore = 0
$totalAfter = 0
foreach ($f in $files) {
    $path = $f.FullName
    $before = $f.Length
    $totalBefore += $before
    try {
        $img = [System.Drawing.Image]::FromFile($path)
        $w = $img.Width
        $h = $img.Height
        if ($w -le $maxSide -and $h -le $maxSide) {
            $nw = $w
            $nh = $h
        } else {
            if ($w -ge $h) {
                $nw = $maxSide
                $nh = [int]([math]::Round($h * $maxSide / $w))
            } else {
                $nh = $maxSide
                $nw = [int]([math]::Round($w * $maxSide / $h))
            }
        }
        $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $nw, $nh)
        $g.Dispose()
        $img.Dispose()
        $tempPath = $path + ".tmp"
        $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Remove-Item $path -Force
        Rename-Item $tempPath $path
        $after = (Get-Item $path).Length
        $totalAfter += $after
        $pct = if ($before -gt 0) { [math]::Round((1 - $after/$before) * 100) } else { 0 }
        Write-Host "$($f.Name): $([math]::Round($before/1024)) KB -> $([math]::Round($after/1024)) KB (-$pct%)"
    } catch {
        Write-Warning "Ошибка: $($f.Name) - $_"
    }
}
$pctTotal = if ($totalBefore -gt 0) { [math]::Round((1 - $totalAfter/$totalBefore) * 100) } else { 0 }
Write-Host ""
Write-Host "Итого: Было $([math]::Round($totalBefore/1MB,1)) MB -> Стало $([math]::Round($totalAfter/1MB,1)) MB (сжатие $pctTotal%)"
