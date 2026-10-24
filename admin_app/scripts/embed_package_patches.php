<?php

declare(strict_types=1);

if ($argc < 3) {
    fwrite(STDERR, "Usage: php embed_package_patches.php <package-dir> <source-patches-dir>\n");
    exit(1);
}

$packageDir = rtrim($argv[1], DIRECTORY_SEPARATOR);
$sourcePatchesDir = rtrim($argv[2], DIRECTORY_SEPARATOR);

if (!is_dir($packageDir)) {
    fwrite(STDERR, "Package directory does not exist: {$packageDir}\n");
    exit(1);
}

if (!is_dir($sourcePatchesDir)) {
    fwrite(STDERR, "Source patches directory does not exist: {$sourcePatchesDir}\n");
    exit(1);
}

$targetPatchesDir = $packageDir . '/vendor/patches';
if (!is_dir($targetPatchesDir) && !mkdir($targetPatchesDir, 0777, true) && !is_dir($targetPatchesDir)) {
    throw new RuntimeException("Unable to create target patches directory: {$targetPatchesDir}");
}

$patchFiles = glob($sourcePatchesDir . '/*.patch');
if ($patchFiles === false || count($patchFiles) === 0) {
    throw new RuntimeException("No patch files found in {$sourcePatchesDir}");
}

foreach ($patchFiles as $patchPath) {
    $basename = basename($patchPath);
    $dest = $targetPatchesDir . '/' . $basename;
    if (!copy($patchPath, $dest)) {
        throw new RuntimeException("Failed to copy patch {$patchPath} to {$dest}");
    }
}

$rewritePatchUrl = static function (string $url): string {
    if (strpos($url, 'admin_app/patches/') === 0 || strpos($url, 'vendor/patches/') === 0) {
        return 'vendor/patches/' . basename($url);
    }
    return $url;
};

$composerFile = $packageDir . '/composer.json';
if (file_exists($composerFile)) {
    $composerRaw = file_get_contents($composerFile);
    if ($composerRaw === false) {
        throw new RuntimeException("Unable to read {$composerFile}");
    }
    $composer = json_decode($composerRaw, true);
    if (!is_array($composer)) {
        throw new RuntimeException("Invalid JSON in {$composerFile}");
    }

    if (isset($composer['extra']['patches']) && is_array($composer['extra']['patches'])) {
        foreach ($composer['extra']['patches'] as $package => $patchMap) {
            if (!is_array($patchMap)) {
                continue;
            }
            foreach ($patchMap as $description => $url) {
                if (!is_string($url)) {
                    continue;
                }
                $composer['extra']['patches'][$package][$description] = $rewritePatchUrl($url);
            }
        }
    }

    $encoded = json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        throw new RuntimeException("Failed to encode {$composerFile}");
    }
    if (file_put_contents($composerFile, $encoded . "\n") === false) {
        throw new RuntimeException("Unable to write {$composerFile}");
    }
}

$patchesLockFile = $packageDir . '/patches.lock.json';
if (file_exists($patchesLockFile)) {
    $lockRaw = file_get_contents($patchesLockFile);
    if ($lockRaw === false) {
        throw new RuntimeException("Unable to read {$patchesLockFile}");
    }
    $lock = json_decode($lockRaw, true);
    if (!is_array($lock)) {
        throw new RuntimeException("Invalid JSON in {$patchesLockFile}");
    }

    if (isset($lock['patches']) && is_array($lock['patches'])) {
        foreach ($lock['patches'] as $pkg => $entries) {
            if (!is_array($entries)) {
                continue;
            }
            foreach ($entries as $idx => $entry) {
                if (!is_array($entry) || !isset($entry['url']) || !is_string($entry['url'])) {
                    continue;
                }
                $lock['patches'][$pkg][$idx]['url'] = $rewritePatchUrl($entry['url']);
            }
        }
    }

    $encoded = json_encode($lock, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        throw new RuntimeException("Failed to encode {$patchesLockFile}");
    }
    if (file_put_contents($patchesLockFile, $encoded . "\n") === false) {
        throw new RuntimeException("Unable to write {$patchesLockFile}");
    }
}

