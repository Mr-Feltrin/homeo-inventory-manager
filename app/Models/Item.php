<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;
use App\Models\Container;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Item extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['name', 'image', 'amount', 'user_id', 'details', 'category_id', 'container_id'];

    protected static function boot(): void
    {
        parent::boot();

        // Set the item's name and details to uppercase before saving to database
        static::creating(function ($item): void {
            $item->name = ucfirst($item->name);
            $item->details = $item->details === '' || empty($item->details) ? null : ucfirst($item->details);
        });

        // Set the item's name and details to uppercase before updating to database
        static::updating(function ($item): void {
            $item->name = ucfirst($item->name);
            $item->details = $item->details === '' || empty($item->details) ? null : ucfirst($item->details);
        });

        // Removes the image from storage when an item is deleted
        static::deleting(function ($object): void {
            if ($object->image) {
                Storage::delete("images/items/{$object->image}");
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function container(): BelongsTo
    {
        return $this->belongsTo(Container::class);
    }

    // Makes sure the amount attribute is actually dirty only when values are different
    public function setAttribute($key, $value): mixed
    {
        if ($key === 'amount') {
            $original = $this->getOriginal($key);
            if ($original == $value) {
                return $this;
            }
        }
        return parent::setAttribute($key, $value);
    }

    // Removes the dirty amount attribute when not actually dirty
    public function isDirty($attributes = null): bool
    {
        if (is_null($attributes)) {
            $attributes = $this->getDirty();
        } else {
            $attributes = is_array($attributes) ? $attributes : func_get_args();
            $attributes = array_intersect_key($this->getDirty(), array_flip($attributes));
        }

        // If the dirty attribute is amount and the value is the same as the original, remove it
        if (array_key_exists('amount', $attributes)) {
            $original = $this->getOriginal('amount');
            if ($original == $attributes['amount']) {
                unset($attributes['amount']);
            }
        }

        return count($attributes) > 0;
    }

    
}
