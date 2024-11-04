<?php

namespace App\Helpers;

use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class ImageHelper
{
    public static function serveImage(string $folder, string $filename)
    {
        $filename = basename($filename);

        $path = storage_path("app/images/{$folder}/{$filename}");
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], Response::HTTP_NOT_FOUND);
        }

        $mimeType = mime_content_type($path);

        return response()->file($path, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
    public static function generateImageName(User $user, UploadedFile $image)
    {
        $timestamp = time();
        $randomString = Str::random(6);
        $extension = $image->getClientOriginalExtension();
        return "{$timestamp}_{$user->id}_{$randomString}.{$extension}";
    }
    
}