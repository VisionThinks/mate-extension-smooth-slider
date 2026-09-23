<?php

declare(strict_types=1);

namespace VisionThinks\ContaoMateSmoothSliderBundle\ContaoManager;

use Contao\CoreBundle\ContaoCoreBundle;
use Contao\ManagerPlugin\Bundle\BundlePluginInterface;
use Contao\ManagerPlugin\Bundle\Config\BundleConfig;
use Contao\ManagerPlugin\Bundle\Parser\ParserInterface;
use VisionThinks\ContaoMateSmoothSliderBundle\ContaoMateSmoothSliderBundle;

final class Plugin implements BundlePluginInterface
{
    public function getBundles(ParserInterface $parser): array
    {
        return [
            BundleConfig::create(
                ContaoMateSmoothSliderBundle::class
            )->setLoadAfter([
                ContaoCoreBundle::class,
            ]),
        ];
    }
}
