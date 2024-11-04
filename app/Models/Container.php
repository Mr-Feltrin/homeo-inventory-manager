<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Container extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = ['name', 'details', 'room_id', 'image'];

    protected static function boot(): void
    {
        parent::boot();

        // Set the container's name and details to uppercase before saving to database
        static::creating(function ($container): void {
            $container->name = ucfirst($container->name);
            $container->details = $container->details === '' || empty($container->details) ? null : ucfirst($container->details);
        });

        // Set the container's name and details to uppercase before updating to database
        static::updating(function ($container): void {
            $container->name = ucfirst($container->name);
            $container->details = $container->details === '' || empty($container->details) ? null : ucfirst($container->details);
        });

        // Removes the image from storage when a container is deleted
        static::deleting(function ($container): void {
            if ($container->image) {
                Storage::delete(paths: "images/containers/{$container->image}");
            }

            // Retrieve all items related to the Container and delete each one
            $container->items()->each(function ($object): void {
                $object->delete();
            });
        });
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
