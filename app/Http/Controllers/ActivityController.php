<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// This controller is responsible for returning the activities of the authenticated user
class ActivityController extends Controller
{
    public function getActivities(Request $request): JsonResponse
    {
        $activities = Activity::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedActivities = $activities->map(function ($activity): array {
            
            $currentModelType = class_basename($activity->current_model_type);
            $currentModelActive = $this->checkModelActive($activity->current_model_type, $activity->current_model_id);

            $changes = json_decode($activity->performed_changes, true);
            if ($changes) {
                foreach ($changes as &$change) {
                    if (isset($change['previousModelType'])) {
                        $change['previousModelActive'] = $this->checkModelActive($change['previousModelType'], $change['previousValue']);
                        $change['previousModelType'] = class_basename($change['previousModelType']);
                    }
                    if (isset($change['newModelType'])) {
                        $change['newModelActive'] = $this->checkModelActive($change['newModelType'], $change['newValue']);
                        $change['newModelType'] = class_basename($change['newModelType']);
                    }
                }
            }
            return [
                'current_model_type' => $currentModelType,
                'current_model_active' => $currentModelActive,
                'current_model_id' => $activity->current_model_id,
                'current_model_name' => $activity->current_model_name,
                'action' => $activity->action,
                'changes' => $changes,
                'created_at' => $activity->created_at,
            ];
        });

        return response()->json($formattedActivities);
    }

    // Verifies if the class is correct and if the model exists
    private function checkModelActive(string $modelType, int $modelId): bool
    {
        if (!class_exists($modelType)) {
            return false;
        }

        return $modelType::find($modelId) !== null;
    }
}
