<?php

declare(strict_types=1);

namespace SPRESS\Dependencies\Sabberworm\CSS;

interface Renderable
{
    public function render(OutputFormat $outputFormat): string;
}
