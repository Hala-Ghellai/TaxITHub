<?php

namespace App\Support;

/**
 * Generates minimal, valid PDF documents (used only for seeding demo data).
 */
class DummyPdf
{
    /**
     * Build a small one-page PDF containing the given text.
     */
    public static function make(string $title, string $body = ''): string
    {
        $text = str_replace(["\r", "\n"], ' ', trim($title).($body !== '' ? " | ".trim($body) : ''));
        // Escape parentheses in PDF string literals.
        $text = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        $objects = [
            "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
            "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
            "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n",
        ];

        $stream = "BT /F1 16 Tf 50 760 Td (".$text.") Tj ET";
        $objects[] = "4 0 obj\n<< /Length ".strlen($stream)." >>\nstream\n".$stream."\nendstream\nendobj\n";
        $objects[] = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";

        $pdf = "%PDF-1.4\n";
        $offsets = [];
        foreach ($objects as $i => $object) {
            $offsets[$i + 1] = strlen($pdf);
            $pdf .= $object;
        }

        $xrefPos = strlen($pdf);
        $pdf .= "xref\n0 ".count($objects)."\n0000000000 65535 f \n";
        foreach ($offsets as $offset) {
            $pdf .= sprintf("%010d 00000 n \n", $offset);
        }
        $pdf .= "trailer\n<< /Size ".count($objects)." /Root 1 0 R >>\nstartxref\n".$xrefPos."\n%%EOF\n";

        return $pdf;
    }
}
