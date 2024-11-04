<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{


    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Room $room): bool
    {
        return $user->id === $room->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Room $room): bool
    {
        $testuserid = $user->id;
        return $user->id === $room->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Room $room): bool
    {
        return $user->id === $room->user_id;
    }
}
