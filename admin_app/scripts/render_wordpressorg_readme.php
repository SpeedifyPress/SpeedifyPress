<?php

declare(strict_types=1);

if ($argc !== 5) {
    fwrite(STDERR, "Usage: php render_wordpressorg_readme.php <template> <changelog> <release> <output>\n");
    exit(1);
}

[$script, $templatePath, $changelogPath, $releasePath, $outputPath] = $argv;

$template = file_get_contents($templatePath);
$changelog = file_get_contents($changelogPath);
$releaseJson = file_get_contents($releasePath);

if ($template === false || $changelog === false || $releaseJson === false) {
    fwrite(STDERR, "Unable to read template, changelog or release metadata.\n");
    exit(1);
}

// Use the shared release metadata rather than maintaining a separate tested version.
$release = json_decode($releaseJson, true);
$tested = is_array($release) ? ($release['tested'] ?? null) : null;
if (!is_string($tested) || !preg_match('/^\d+\.\d+(?:\.\d+)?$/D', $tested)) {
    fwrite(STDERR, "Release metadata must contain a valid tested WordPress version.\n");
    exit(1);
}

// WordPress.org expects the release series (7.1), not the patch version (7.1.3).
$tested = implode('.', array_slice(explode('.', $tested), 0, 2));

if (strpos($template, '{{TESTED_UP_TO}}') === false) {
    fwrite(STDERR, "Readme template is missing the tested-version placeholder.\n");
    exit(1);
}

$renderedChangelog = renderChangelog($changelog);
if (trim($renderedChangelog) === '') {
    fwrite(STDERR, "No changelog entries could be rendered.\n");
    exit(1);
}
$output = str_replace(
    ['{{CHANGELOG}}', '{{TESTED_UP_TO}}'],
    [$renderedChangelog, $tested],
    $template
);

if (file_put_contents($outputPath, $output) === false) {
    fwrite(STDERR, "Unable to write output readme.\n");
    exit(1);
}

function renderChangelog(string $markdown): string
{

    // Read complete release sections, including blank lines, categories and nested bullets.
    preg_match_all('/^###\s+([^\r\n]+)\R([\s\S]*?)(?=^###\s+|\z)/m', $markdown, $matches, PREG_SET_ORDER);

    $sections = [];
    $maxSections = 5;

    foreach ($matches as $match) {
        $versionLine = trim($match[1]);
        $bulletsBlock = trim($match[2]);

        if ($versionLine === '' || $bulletsBlock === '') {
            continue;
        }

        $version = preg_replace('/\s+-\s+\d{4}-\d{2}-\d{2}$/', '', $versionLine) ?? $versionLine;
        $section = '= ' . trim($version) . " =\n\n";
        $hasBullets = false;

        $bullets = preg_split('/\R/', $bulletsBlock) ?: [];
        foreach ($bullets as $bullet) {
            if (preg_match('/^####\s+(.+)$/', trim($bullet), $category)) {
                $section .= "\n**" . trim($category[1]) . "**\n\n";
            } elseif (preg_match('/^(\s*)-\s+(.+)$/', $bullet, $item)) {
                $section .= $item[1] . '* ' . $item[2] . "\n";
                $hasBullets = true;
            }
        }

        if (!$hasBullets) continue;

        $sections[] = rtrim($section);

        if (count($sections) >= $maxSections) {
            break;
        }
    }

    return implode("\n\n", $sections) . "\n";
}
