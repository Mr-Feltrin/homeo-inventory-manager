<?php
// app/Models/Room.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Container;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Room extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['name', 'description', 'user_id', 'image'];

    protected static function boot(): void
    {
        parent::boot();

        // Set the room's name and description to uppercase before saving to database
        static::creating(function ($room): void {
            $room->name = ucfirst($room->name);
            $room->description = $room->description === '' || empty($room->description) ? null : ucfirst($room->description);
        });

        // Set the room's name and description to uppercase before updating to database
        static::updating(function ($room): void {
            $room->name = ucfirst($room->name);
            $room->description = $room->description === '' || empty($room->description) ? null : ucfirst($room->description);
        });

        // Listen for the deleting event of a room
        static::deleting(function ($room): void {
            // Delete the room's image from storage
            if ($room->image) {
                Storage::delete("images/rooms/{$room->image}");
            }

            // Retrieve all containers related to the room and delete each one
            $room->containers()->each(function ($container): void {
                $container->delete();
            });
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function containers(): HasMany
    {
        return $this->hasMany(Container::class);
    }
}
