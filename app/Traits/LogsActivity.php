<?php

namespace App\Traits;

use App\Models\Activity;
use App\Models\Category;
use App\Models\Container;
use App\Models\Room;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity(): void
    {
        static::created(function (Model $model): void {
            $model->logActivity('created');
        });

        static::updated(function ($model): void {
            $model->logActivity('updated');
        });

        static::deleted(function ($model): void {
            $model->logActivity('deleted');
        });
    }

    // Set the logic for the activity performed
    protected function logActivity(string $action): void
    {
        $userId = Auth::id();
        $actionModel = $this;
        $activity = new Activity();
        $activity->user_id = $userId;
        $activity->action = $action;
        $activity->current_model_id = $actionModel->id;
        $activity->current_model_type = get_class($actionModel);
        $activity->current_model_name = $actionModel->name;

        if ($action === "updated") {
            $dirty = $actionModel->getDirty();
            unset($dirty['updated_at']);
            
            if (array_key_exists('amount', $dirty)) {
                if ($dirty['amount'] === $actionModel->getOriginal('amount')) {
                    unset($dirty['amount']);
                }
            }

            $actionModel->isDirty();

            $changes = [];
            $foreignKeys = ['room_id', 'category_id', 'container_id'];

            foreach ($dirty as $column => $newValue) {
                $oldValue = $actionModel->getOriginal($column);

                if (in_array($column, $foreignKeys, true)) {
                    $previousModel = null;
                    $newModel = null;

                    if ($column === 'room_id') {
                        $previousModel = Room::find($oldValue);
                        $newModel = Room::find($newValue);
                    } elseif ($column === 'container_id') {
                        $previousModel = Container::find($oldValue);
                        $newModel = Container::find($newValue);
                    } elseif ($column === 'category_id') {
                        $previousModel = Category::find($oldValue);
                        $newModel = Category::find($newValue);
                    }

                    $changes[$column] = [
                        'previousModelName' => $previousModel?->name,
                        'previousModelType' => get_class($previousModel),
                        'previousValue' => $oldValue,
                        'newModelName' => $newModel?->name,
                        'newModelType' => get_class($newModel),
                        'newValue' => $newValue,
                    ];
                } else {
                    $changes[$column] = [
                        'previousValue' => $oldValue,
                        'newValue' => $newValue,
                    ];
                }
            }
            $activity->performed_changes = json_encode($changes, JSON_THROW_ON_ERROR);
        }

        // Check if the user has more than 7 activities
        $activityCount = Activity::where('user_id', $userId)->count();
        if ($activityCount >= 8) {
            // Delete the oldest activity
            Activity::where('user_id', $userId)
                ->orderBy('created_at', 'asc')
                ->first()
                ->delete();
        }

        $activity->save();
    }
}
