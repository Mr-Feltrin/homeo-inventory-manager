<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;
use Exception;

class HandleExceptions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (ModelNotFoundException $e) {
            $modelName = class_basename($e->getModel());
            Log::error("ModelNotFoundException: The intended {$modelName} could not be found", ['exception' => $e]);
            return apiErrorResponse(['message' => "The intended {$modelName} could not be found"], 404);
        } catch (QueryException $e) {
            Log::error('QueryException: A database error occurred while performing this action', ['exception' => $e]);
            return apiErrorResponse(['message' => 'A database error occurred while performing this action'], 500);
        } catch (ValidationException $e) {
            Log::error('ValidationException: Validation failed', ['exception' => $e]);
            return apiErrorResponse($e->errors(), 422);
        } catch (AuthorizationException $e) {
            Log::error('AuthorizationException: You are not authorized to perform this action', ['exception' => $e]);
            return apiErrorResponse(['message' => 'You are not authorized to perform this action'], 403);
        } catch (FileException $e) {
            Log::error('FileException: An error occurred while handling the file', ['exception' => $e]);
            return apiErrorResponse(['message' => 'An error occurred while handling the file: ' . $e->getMessage()], 500);
        } catch (AuthenticationException $e) {
            Log::error('AuthenticationException: Authentication required', ['exception' => $e]);
            return apiErrorResponse(['message' => 'Authentication required'], 401);
        } catch (Exception $e) {
            Log::error('Exception: n internal server error has occurred', ['exception' => $e]);
            return apiErrorResponse(['message' => 'An internal server error has occurred'], 500);
        }
    }
}
