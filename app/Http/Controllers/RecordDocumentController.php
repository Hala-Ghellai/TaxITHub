<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Streams the stored PDF documents. Files live on the private filesystem
 * disk (storage/app/private), so they are never publicly guessable — access
 * is always authenticated.
 */
class RecordDocumentController extends Controller
{
    public function show(Record $record): StreamedResponse|HttpResponse
    {
        abort_if(! $record->hasPdf(), 404);

        return $this->stream($record->pdf_path, $record->title.'.pdf');
    }

    public function tahmish(Record $record): StreamedResponse|HttpResponse
    {
        abort_if(! $record->hasTahmish(), 404);

        return $this->stream($record->tahmish_path, 'تهميش - '.$record->title.'.pdf');
    }

    private function stream(string $path, string $filename): StreamedResponse|HttpResponse
    {
        if (! Storage::disk('local')->exists($path)) {
            abort(404);
        }

        // `response()` streams with an `inline` Content-Disposition so the PDF
        // is displayed in the browser instead of being downloaded.
        return Storage::disk('local')->response($path, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
