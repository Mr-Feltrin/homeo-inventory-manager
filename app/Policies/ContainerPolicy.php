<?php

namespace App\Policies;

use App\Models\Container;
use App\Models\User;

class ContainerPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Container $container): bool
    {
        return $user->id === $container->room->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Container $container): bool
    {
        return $user->id === $container->room->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Container $container): bool
    {
        return $user->id === $container->room->user_id;
    }
}
