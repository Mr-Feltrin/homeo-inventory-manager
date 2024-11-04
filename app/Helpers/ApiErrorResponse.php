<?php

// Helper function to return errors in a well defined pattern
if (!function_exists('apiErrorResponse')) {
    function apiErrorResponse(array $errors, int $statusCode = 500)
    {
        return response()->json(['errors' => $errors], $statusCode);
    }
}
