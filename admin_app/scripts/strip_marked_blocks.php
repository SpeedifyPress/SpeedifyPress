<?php

declare(strict_types=1);

if ($argc < 2) {
    fwrite(STDERR, "Package directory is required.\n");
    exit(1);
}

$packageDir = rtrim($argv[1], DIRECTORY_SEPARATOR);

if (!is_dir($packageDir)) {
    fwrite(STDERR, "Package directory does not exist: {$packageDir}\n");
    exit(1);
}

/**
 * Removes <ProOnly>...</ProOnly> line-marker blocks from file content.
 * Markers must be on their own lines, e.g.:
 * //<ProOnly>
 * code...
 * //</ProOnly>
 *
 * @param string $contents
 * @param string $file
 * @return string
 */
function stripProOnlyBlocks(string $contents, string $file): string
{

    $lines = preg_split('/\R/', $contents);
    if (!is_array($lines)) {
        return $contents;
    }

    $result = [];
    $inBlock = false;

    foreach ($lines as $index => $line) {
        $lineNo = $index + 1;
        $trimmed = trim($line);
        $hasStart = (bool) preg_match('/^(?:\/\/|\/\*+|#|<!--)?\s*<ProOnly>\s*(?:\*\/|-->)*\s*$/', $trimmed);
        $hasEnd = (bool) preg_match('/^(?:\/\/|\/\*+|#|<!--)?\s*<\/ProOnly>\s*(?:\*\/|-->)*\s*$/', $trimmed);

        if ($hasStart && $hasEnd) {
            throw new RuntimeException("Invalid combined ProOnly markers in {$file}:{$lineNo}");
        }

        if ($hasStart) {
            if ($inBlock) {
                throw new RuntimeException("Nested <ProOnly> marker in {$file}:{$lineNo}");
            }
            $inBlock = true;
            continue;
        }

        if ($hasEnd) {
            if (!$inBlock) {
                throw new RuntimeException("Unmatched </ProOnly> marker in {$file}:{$lineNo}");
            }
            $inBlock = false;
            continue;
        }

        if (!$inBlock) {
            $result[] = $line;
        }
    }

    if ($inBlock) {
        throw new RuntimeException("Unclosed <ProOnly> marker in {$file}");
    }

    return implode("\n", $result);
}

$extensions = ['php', 'js', 'css', 'vue'];
$skipDirs = ['.git', 'node_modules', 'vendor'];
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($packageDir, FilesystemIterator::SKIP_DOTS)
);

foreach ($iterator as $fileInfo) {
    if (!$fileInfo->isFile()) {
        continue;
    }

    $path = $fileInfo->getPathname();
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (!in_array($ext, $extensions, true)) {
        continue;
    }

    $normalized = str_replace('\\', '/', $path);
    $skip = false;
    foreach ($skipDirs as $skipDir) {
        if (strpos($normalized, "/{$skipDir}/") !== false) {
            $skip = true;
            break;
        }
    }
    if ($skip) {
        continue;
    }

    $contents = file_get_contents($path);
    if ($contents === false) {
        throw new RuntimeException("Unable to read file: {$path}");
    }

    $updated = stripProOnlyBlocks($contents, $path);
    if ($updated !== $contents) {
        if (file_put_contents($path, $updated) === false) {
            throw new RuntimeException("Unable to write file: {$path}");
        }
    }
}
